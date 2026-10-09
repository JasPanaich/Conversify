// Store holds data that many components need to share globally
import { create } from 'zustand';
import {axiosInstance} from "../lib/axios"
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser:null, 
    isCheckingAuth:true,
    isSigningup:false,
    isLoggingIn:false,

    // Check to see if user is already logged in
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data })
        } catch (error) {
            console.log("Error in authCheck", error);
            set({ authUser : null }) // Failed to fetch users state
        } finally {
            set({ isCheckingAuth : false }); // Eventually, the state should be false
        }

    },

    signup : async(data) => {
        try {
            set({ isSigningup : true });
            const res = await axiosInstance.post("/auth/signup", data); // Send the data to the backend
            set({ authUser : res.data }); // Update the authUser state with the response data
        
            // Toast to show success message
            toast.success("Account created successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningup : false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser : null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
            console.log("Error in logout", error);
        }
    },

    login : async(data) => {
        try {
            set({ isLoggingIn : true });
            const res = await axiosInstance.post("/auth/login", data); 
            set({ authUser : res.data }); 
        
            // Toast to show success message
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn : false });
        }
    },

    updateProfile: async(data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser : res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
},
}));


