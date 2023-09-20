import express from "express";
import cors from "cors";
import { createHash } from "crypto";
import * as db from "./db"
import session from "express-session";
import RedisStore from "connect-redis";
import payments from "./payments"

declare module "express-session" {
    interface SessionData {
        logged: boolean;
        cd: any
    }
}

const port = process.env.APP_PORT || 8100;
const app = express();

const storeRedis = new RedisStore({
    client: db.rDb as any,
});

app.set("x-powered-by", false);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
})

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
        if (password) {
            return password.length >= 10 && password.length <= 36 && password.match(/\d/g)!.length >= 1 && password.match(/[a-z]/g)!.length >= 1 && password.match(/[A-Z]/g)!.length >= 1; 
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
        // res.sendStatus(200)
        res.redirect("http://localhost:5174/logged=true");
    }
    else res.redirect("http://localhost:5174/account/login?status=401");
});

// Handle all what is coupled with payments
app.use(["payments", "payments-api"], payments);

app.listen(8100, () => {
    console.log("App listen on port: ", port)
});
