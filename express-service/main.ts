import express from "express";
import cors from "cors";

const port = process.env.APP_PORT || 8100;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Entire app
app.post("/signup", (req, res) => {
    /** When user signup */
    const bd = req.body;
    res.sendStatus(200);
});

app.listen(8100, () => {
    console.log("App listen on port: ", port)
});
