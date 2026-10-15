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

    // Fetch all contacts for the current user
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
    
    // Fetch chat partners for the current user
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

    // Fetch messages for a specific user
    getMessagesByUserId: async (userId) => {
        set ({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set ({ isMessagesLoading: false });
        }
},

    // Send a message to a specific user
    sendMessage: async ({messageData}) => {
        // Get the selected user from the store
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`; // Temporary ID for the message until the server responds

        // So message can be displayed immediately in the UI before the server responds
        const optimisticMessage = {
            _id:tempId,
            sender: authUser._id,
            receiver: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(), // Use current timestamp for optimistic message
            isOptimistic: true, // Flag to indicate that this is an optimistic message
        };
        
        // Immediately update the messages state with the optimistic message so that it appears in the UI before the server responds
        set({messages: [...messages, optimisticMessage]}); // Add the optimistic message to the messages state

        try {
            // Send a POST request to the server to send the message so that it can be stored in the database and then update the messages state with the new message
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: messages.concat(res.data)});
        } catch (error) {
            set({messages: messages}); // Revert to the previous messages state if the request fails
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    }
}));