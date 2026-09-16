import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Post because we are sending data to the server to create a new user or authenticate an existing user
router.post("/signup", signup);
router.post("/login", login);  
router.post("/logout", logout);

export default router;