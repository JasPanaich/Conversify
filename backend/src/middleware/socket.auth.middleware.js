import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

// Middleware function to authenticate and authorize socket connections using JWT tokens
export const socketAuthMiddleware = async (socket, next) => {
    try {
        // Extract the JWT token from cookies
        const token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

        // Check if the token is present; if not, throw an error
        if (!token) {
            console.log("No token found in cookies");
            return next(new Error("Authentication error: No token provided"));
        }

        // Verify the JWT token using the secret key from environment variables
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Token verification failed");
            return next(new Error("Authentication error: Invalid token"));
        }

        // Find the user in the database using the decoded user ID from the token
        const user = await User.findById(decoded.userId).select("-password"); // Exclude the password field from the user object
        if (!user) {
            console.log("User not found for the provided token");
            return next(new Error("Authentication error: User not found"));
        }

        // Attach the authenticated user to the socket object for use in subsequent event handlers
        socket.user = user;
        socket.userId = user._id.toString(); 

        console.log(`Socket authenticated for user: ${user.username} (ID: ${user._id})`);

        next(); // Call the next middleware or event handler in the chain
    } catch (error) {
        console.error("Error in socket authentication:", error.message);
        return next(new Error("Authentication error: Internal server error"));
    }
};