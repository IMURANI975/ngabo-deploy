import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import appointmentsRouter from './routes/appointments.js';
import contactsRouter from './routes/contacts.js';
import servicesRouter from './routes/services.js';
import teamRouter from './routes/team.js';
import testimonialsRouter from './routes/testimonials.js';
import galleryRouter from './routes/gallery.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';

import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb+srv://mike200:mike200@cluster0.d0hgpdh.mongodb.net/ngabo-saloon?appName=Cluster0';

// ES modules dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/team', teamRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

// ================= SOCKET.IO SETUP =================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://www.ngabofashionhairsaloon.com/', // later restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Export io so other files can emit events
export { io };

// ================= START SERVER =================
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
