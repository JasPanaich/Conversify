import jwt from "jsonwebtoken"; // Generate a JSON Web Token (JWT) for user authentication

// Create a function to generate a JWT token for a user based on their user ID
export const generateToken = (userId, res) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({userId}, JWT_SECRET, { expiresIn: "7d" }); 

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 7 days
        httpOnly: true, // Make the cookie accessible only through HTTP requests, not JavaScript
        sameSite: "strict", // Ensure the cookie is sent only to the same site, preventing CSRF attacks
        secure: process.env.NODE_ENV === "development" ? false : true // Set the cookie to be secure (HTTPS) in development mode, and secure in production mode
    });

    return token;
};