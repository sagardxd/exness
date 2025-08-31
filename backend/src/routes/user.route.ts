import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
    res.send("User signed up");
});

router.post("/signin", (req, res) => {
    // Handle user login
    res.send("User logged in");
});