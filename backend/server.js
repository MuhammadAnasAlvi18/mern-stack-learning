import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import studentModel from './models/studentModels.js';

const app = express();

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

app.use(cors(corsOptions));
app.use(express.json());

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

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://root:developer@cluster0.ycfxdos.mongodb.net/studentdb?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const ensureConnection = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({
      success: false,
      error: 'Database connection error. Please try again.'
    });
  }
  next();
};

app.post("/api/add-student", ensureConnection, async (req, res) => {
  try {
    const { name, age, standard } = req.body;
    
    if (!name || !age || !standard) {
      return res.status(400).json({ 
        success: false, 
        error: "All fields are required" 
      });
    }

    const student = await studentModel.create({
      name,
      age,
      standard
    });

    res.status(201).json({ 
      success: true, 
      data: student 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message || "Internal server error"
    });
  }
});

app.get("/api/get-students", ensureConnection, async (req, res) => {
  try {
    const students = await studentModel.find();
    res.status(200).json({ 
      success: true, 
      data: students 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message || "Internal server error"
    });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error"
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

export default app;