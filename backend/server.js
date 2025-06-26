import express from 'express';
import { connectDB } from './lib/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === "production"
      ? "https://mern-stack-learning-frontend.vercel.app"
      : "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth" , authRoutes)

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        connectDB();
    });
}
