import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js"
 

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // translates incoming requests w/ JSON to let Node.js understand it
app.use(cors({origin:ENV.CLIENT_URL, credentials:true})); // Allow frontend to send cookies -> backend
app.use(cookieParser());

// Handling API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Make application ready for deployment as a single combined server on the backend
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // For URL without specified route, send back React main file (index.html) to allow React Router to handle routing on the frontend
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// To have the socket real-time communication 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Connect to the database when the server starts
});