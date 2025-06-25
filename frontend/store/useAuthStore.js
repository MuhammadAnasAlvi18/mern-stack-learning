import {create} from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isCheckAuth: true,
    
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/check');
            set({ user: res.data });
        } catch (error) {
            console.log(error.message);
            set({ user: null });
        } finally {
            set({ isCheckAuth: false });
        }
    },
}));
