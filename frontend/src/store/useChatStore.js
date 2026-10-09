import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// Create a Zustand store for chat-related state management
export const useChatStore = create((set,get) => ({
    allContacts: [], // List of all contacts
    chats: [], // Chat partners
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    setActiveTab: (tab) => set({ activeTab: tab }), 
    setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),

    getAllContacts: async () => {
        set ({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set ({ isUserLoading: false });
        }
    },

    getMyChatPartners: async () => {
        set ({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set ({ isUserLoading: false });
        }
    },
}));