import express from "express";
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js"

// The middlewares execute in order, so requests first get rate-limited, then authenticated
// More efficient since authenticated requests get blocked by rate limiting before hitting auth middleware
const router = express.Router();

router.use(arcjetProtection, protectRoute);

// Get all of the user contacts, chats, messages, and be able to send  messages
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId); // Colon because it is a dynamic value
router.post("/send/:id", sendMessage); 

export default router;