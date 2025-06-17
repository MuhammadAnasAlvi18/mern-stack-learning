import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import studentModel from './models/studentModels.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://root:developer@cluster0.ycfxdos.mongodb.net/")
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Routes
app.post("/api/add-student", async (req, res) => {
    try {
        const { name, age, standard } = req.body;
        
        // Validate input
        if (!name || !age || !standard) {
            return res.status(400).json({ 
                success: false, 
                error: "All fields are required" 
            });
        }

        const student = await studentModel.create({
            name: name,
            age: age,
            standard: standard
        });

        res.status(201).json({ 
            success: true, 
            data: student 
        });
    } catch (err) {
        console.error("Error creating student:", err);
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});

app.get("/api/get-students", async (req, res) => {
    try {
        const students = await studentModel.find();
        res.status(200).json({ 
            success: true, 
            data: students 
        });
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

// Export for Vercel
export default app;