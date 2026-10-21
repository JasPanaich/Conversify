import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from './env.js';
import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js';

// Create server that includes rest API and Socket.IO server
const app = express(); 
const server = http.createServer(app);

// Initialize a new instance of the Socket.IO server, passing in the HTTP server and configuration options
const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL], // Allow requests from the specified client URL
        credentials: true, // Allow cookies to be sent with requests
    }
});

// Apply authentication middleware to the Socket.IO server to verify JWT tokens for incoming connections
io.use(socketAuthMiddleware);

// Checks if user is online or not
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

// Storing online users 
const userSocketMap = {}; // {userId:socketId}


io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id

    // To inform other users a user has logged in (sending event to all connected clients)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // With socket.on, listen for events from clients
    socket.on("disconnect", () => {
        console.log("A user disconneted", socket.user.fullName)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Inform everyone that a user has disconnected
    });
});

export {io, app, server};