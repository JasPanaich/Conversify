import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express(); 

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Make application ready for deployment as a single combined server on the backend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // For URL without specified route, send back React main file (index.html) to allow React Router to handle routing on the frontend
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}




app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});