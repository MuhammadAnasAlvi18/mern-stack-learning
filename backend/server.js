import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import studentModel from './models/studentModels.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://mern-stack-learning-frontend.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://root:developer@cluster0.ycfxdos.mongodb.net/studentdb?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const ensureConnection = (req, res, next) =>
  mongoose.connection.readyState === 1
    ? next()
    : res.status(500).json({ success: false, error: 'DB not connected' });

app.post("/api/add-student", ensureConnection, async (req, res) => {
  const { name, age, standard } = req.body;
  if (!name || !age || !standard)
    return res.status(400).json({ success: false, error: "All fields required" });
  try {
    const student = await studentModel.create({ name, age, standard });
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/get-students", ensureConnection, async (req, res) => {
  try {
    const students = await studentModel.find();
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

if (process.env.NODE_ENV !== 'production')
  app.listen(3000, () => console.log('Server on 3000'));

export default app;