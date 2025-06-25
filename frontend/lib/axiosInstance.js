import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://mern-stack-learning-backend.vercel.app/api/auth",
    withCredentials: true
});