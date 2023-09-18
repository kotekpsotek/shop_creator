import express from "express";
import cors from "cors";
import { createHash } from "crypto";
import * as db from "./db"

const port = process.env.APP_PORT || 8100;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.listen(8100, () => {
    console.log("App listen on port: ", port)
});
