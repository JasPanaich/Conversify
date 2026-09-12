// User model to communicate with the database and perform CRUD operations related to users
import mongoose from "mongoose";

// Schema so that we can define the structure of the user data in the database
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: ""
    },
},
    { timestamps: true } // creates createdAt and updatedAt fields automatically
); 

// Create a model from the schema so that we can use it to interact with the database
const User = mongoose.model("User", userSchema);

export default User;