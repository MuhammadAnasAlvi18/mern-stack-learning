import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import studentModel from './models/studentModels.js';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://mern-stack-learning-frontend.vercel.app'
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

// MongoDB Connection Options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://root:developer@cluster0.ycfxdos.mongodb.net/studentdb?retryWrites=true&w=majority";

let isConnecting = false;
let connectionPromise = null;

// MongoDB Connection
const connectDB = async () => {
  if (isConnecting) {
    return connectionPromise;
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  isConnecting = true;
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      console.log('Attempting to connect to MongoDB...');
      const conn = await mongoose.connect(MONGODB_URI, mongooseOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      isConnecting = false;
      resolve(conn);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      isConnecting = false;
      reject(error);
    }
  });

  return connectionPromise;
};

// Initial connection
connectDB().catch(console.error);

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
  isConnecting = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  isConnecting = false;
  connectDB().catch(console.error);
});

// Middleware to ensure DB connection
const ensureConnection = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection error. Please try again.'
    });
  }
};

// Routes
app.post("/api/add-student", ensureConnection, async (req, res) => {
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

app.get("/api/get-students", ensureConnection, async (req, res) => {
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
app.get("/api/health", async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbStatus = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        }[dbState] || 'unknown';

        res.status(200).json({ 
            status: "ok",
            mongodb: dbStatus,
            readyState: dbState,
            isConnecting
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
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