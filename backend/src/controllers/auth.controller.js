// Controller to hold logic for API routes
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

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

        // TODO: Send a welcome email to the user after successful signup (optional)
        
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: "InternalServer error" });
    }
};