import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});

import express from "express";
import cors from "cors";
import fs from "fs";
import { createHash, randomUUID } from "crypto";
import * as db from "./db"
import session from "express-session";
import cookieParser from "cookie-parser";
import RedisStore from "connect-redis";
import payments from "./payments"

declare module "express-session" {
    interface SessionData {
        logged: boolean;
        /** User uid */
        uuid: string
    }
}

const port = process.env.APP_PORT || 8100;
const app = express();

const storeRedis = new RedisStore({
    client: db.rDb as any,
});

app.set("x-powered-by", false);
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "3.5mb" }));
app.use(session({
    name: "sess",
    store: storeRedis as any,
    resave: true,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1_000
    },
    secret: "in my neighbourhood is cat which always like used to: Meoooowwwwwwwwwwwwwwww"
}))
app.use((req, res, nxt) => {
    res.setHeader("x-powered-by", "my own idea");
    nxt()
});

// Entire app
app.post("/signup", async (req, res) => {
    /** When user signup */
    const { email, password }: { email: string, password: string } = req.body;
    console.log(req.body)

    function varyEmail() {
        if (email?.includes("@")) {
            return email.trim().split("@").every(v => v.length > 1)
        }
        
        return false;
    }

    function varyPassword() {
        const matchBy = (term: RegExpMatchArray | null) => {
            if (!term || !term.length) {
                return []
            }

            return term;
        };
        if (password) {
            return password.length >= 10 && password.length <= 36 && matchBy(password.match(/\d/g)).length >= 1 && matchBy(password.match(/[a-z]/g)).length >= 1 && matchBy(password.match(/[A-Z]/g)).length >= 1; 
        }

        return false;
    }

    function pasHash() {
        const hash = createHash("shake-256");
        hash.update(password, "utf-8");

        return hash.digest("hex");
    }
    
    if (varyEmail() && varyPassword() && !(await db.mUsers.exists({ email }))) {
        const passwordHash = pasHash();
        
        await db.mUsers.create({
            email,
            password: passwordHash
        });

        res.redirect("http://localhost:5173/account/created");
    }
    else res.redirect("http://localhost:5173/account/create?invalid=true")
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userEx = await db.mUsers.findOne({ email });

    // Create password auth hash
    const digest = createHash("shake256");
    digest.update(password || "", "utf-8");
    const passwordHash = digest.digest("hex");

    // Action
    if (userEx && userEx.password == passwordHash) {
        req.session.logged = true;
        req.session.uuid = userEx.uuid as string;
        res.redirect("http://localhost:5173/account/login?logged="+req.sessionID); // Create one time identifier as replacement for 'sessionID'
    }
    else res.redirect("http://localhost:5173/account/login?status=401");
});

// Handle actions only for logged in users 
// For call all actions below: User must be firstly logged in
app.use(async (req, res, xt) => {
    // Parse cookie from other domain with session id
    const cookie = req.cookies["session-app-frontend"];
    if (cookie) {
        const sessId = atob(cookie);
        storeRedis.get(sessId, (_, data) => {
            req.session.reload(() => void undefined);

            if (data?.logged) {
                // FIXME: Should be commented to do not ceate same session for one user both times: 1 - Durning login, 2 - durning receive "session-app-frontend" cookie // req.session = Object.assign(req.session, data); // Assign this send to user express-session cookie which is independent from "session-app-frontend"
                res.locals.appSes = data; // In this way because intialized express-session by call req.session create other session object in database duplicate in this already existing created durning login
                xt();
            }
            else res.sendStatus(401)
        });
    }
    else if (!cookie) res.sendStatus(401);
})

// Handle all what is coupled with payments
app.use(["/payments", "/payments-api"], payments);

// Create shop
app.post("/create-shop", async (req, res) => {
    const { name, logo, shop_type, layout }: { name: string, shop_type: string, logo: { mime: string, cnt: Record<string, number>, name: string }, layout: string } = req.body;
    const affordableMimes = ["image/svg+xml", "image/jpeg", "image/png", "image/webp", "image/gif"];
    const ext: { [id: string]: string } = {
        "image/svg+xml": "svg",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
    }
    function checkLogo() {
        const maximumSizeOfLogoMb = 3.5;
        
        return logo != undefined && affordableMimes.includes(logo.mime) && (Object.entries(logo.cnt).length / 1_048_576 <= maximumSizeOfLogoMb);
    }

    if (name && checkLogo() && shop_type && layout) {
        /** Check: shop exists, existing shop has got this layout */
        function shopCorrectennes(): boolean {
            const combinations: Record<string, string[]> = {
                fashion: ["remarkable-blackwhite"]
            }

            return combinations[shop_type]?.includes(layout) ? true : false;
        }

        if (shopCorrectennes()) {
            const shopId = randomUUID();
            
            // Save into database
            await db.cDb.execute("INSERT INTO shops (shop_id, owner_id, name, creation_time, income_eur, layout_selected, logo_path, shop_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [shopId, res.locals.appSes.uuid, name, Date.now(), 0, layout, "", shop_type], { prepare: true });

            // Save image -> Yes size and mime of type is checking before save TODO: check file container also to prevent SSRF
            fs.writeFileSync(`./temp/shop-logo-${shopId}.${ext[logo.mime]}`, Buffer.from(Object.values(logo.cnt)));

            res.status(200).json({ shop_id: shopId });
        }
        else res.sendStatus(400);
    }
    else res.sendStatus(400);
});

// Check shop exists
app.post("/shop-exists-check", async (req, res) => {
    const { shop_id } = req.body;

    const check = await db.cDb.execute("SELECT shop_id FROM shops WHERE shop_id = ? ALLOW FILTERING;", [shop_id], {
        prepare: true
    });

    if (check.rows.length) {
        res.sendStatus(200);
    }
    else res.sendStatus(404);
});

// Get all shop items
app.post("/get-shop-items", async (req, res) => {
    const { shop_id } = req.body;

    if (shop_id) {
        const items = (await db.cDb.execute("SELECT * FROM items WHERE shop_id = ?", [shop_id], { prepare: true })).rows;
        console.log(items)
    
        if (items.length) {
            res.status(200).json({ items });
        }
        else res.sendStatus(404);
    }
    else res.sendStatus(404);
});

app.listen(8100, () => {
    console.log("App listen on port: ", port)
});
