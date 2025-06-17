import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import studentModel from './models/studentModels.js';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://127.0.0.1:5173', // Vite dev server alternative
  'https://mern-stack-learning-frontend.vercel.app' // Production frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://root:developer@cluster0.ycfxdos.mongodb.net/");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.post("/api/add-student", async (req, res) => {
    try {
        console.log('Received add-student request:', req.body);
        const { name, age, standard } = req.body;
        
        // Validate input
        if (!name || !age || !standard) {
            console.log('Validation failed:', { name, age, standard });
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

        console.log('Student created successfully:', student);
        res.status(201).json({ 
            success: true, 
            data: student 
        });
    } catch (err) {
        console.error("Error creating student:", err);
        res.status(500).json({ 
            success: false, 
            error: err.message || "Internal server error"
        });
    }
});

app.get("/api/get-students", async (req, res) => {
    try {
        console.log('Fetching students...');
        const students = await studentModel.find();
        console.log('Students fetched:', students);
        res.status(200).json({ 
            success: true, 
            data: students 
        });
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ 
            success: false, 
            error: err.message || "Internal server error"
        });
    }
});

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ 
        status: "ok",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        error: err.message || "Internal server error"
    });
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