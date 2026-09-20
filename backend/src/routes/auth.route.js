import express from "express";
import { signup, login, logout, updateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Post because we are sending data to the server to create a new user or authenticate an existing user
router.post("/signup", signup);
router.post("/login", login);  
router.post("/logout", logout);

// Put because we are updating the user's profile information, and we are using the protectRoute middleware (function ran before sending back response) to ensure that only authenticated users can access this route
router.put("/update-profile", protectRoute, updateProfile);

// Checking if user is authenticated 
router.get("/check", protectRoute, (req,res) => res.status(200).json(req.user));

export default router;