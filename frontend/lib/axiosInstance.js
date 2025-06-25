import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth" || "https://mern-stack-learning-backend.vercel.app/api/auth",
    withCredentials: true
});