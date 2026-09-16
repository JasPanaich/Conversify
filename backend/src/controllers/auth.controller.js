// Controller to hold logic for API routes
import { sendWelcomeEmail } from "../emails/emailHandlers.js"; // Import the sendWelcomeEmail function
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js"; 


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email is valid: regex pattern for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Find if a user with the same email already exists in the database
    const user = await User.findOne({email});
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Hash password to encrypt it before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create a new user instance with the provided data and hashed password
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    // Authenticate user and generate a token for them if the user is successfully created so they can access protected routes
    if (newUser) {
        // Persist user first, then issue auth cookie
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res); 
        
        // Return the new user's data in the response, excluding the password
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

        try {
            // Send welcome email to the new user
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: "InternalServer error" });
    }
};

// Create login function to authenticate user and generate a token for them if the user is successfully authenticated so they can access protected routes
export const login = async (req, res) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Check if email and password are provided
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: "Invalid Credentials" }); // Never tell client which one is incorrect for security reasons

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" }); 

        generateToken(user._id, res); // Generate token and set it in the response cookie

        // Return the user's data in the response, excluding the password
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Create logout function to clear the authentication token from the response cookie
export const logout = async (_, res) => {
    res.cookie("jwt","",{maxAge: 0});
    res.status(200).json({ message: "Logged out successfully" });
};