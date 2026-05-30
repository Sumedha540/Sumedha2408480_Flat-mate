import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js'
import khaltiRoutes from './routes/khalti.js'
import bookingRoutes from './routes/bookings.js'
import propertyRoutes from './routes/properties.js'
import messageRoutes from './routes/messages.js'
import userRoutes from './routes/users.js'
import contactRoutes from './routes/contact.js'
import historyRoutes from './routes/history.js'

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://sumedha2408480-flat-mate-spd6.onrender.com', // ✅ correct frontend URL
];

console.log('🌐 CORS enabled for origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Handle preflight requests for all routes
app.options('*', cors());

app.use('/auth', authRoutes);
app.use('/api/payment/khalti', khaltiRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/history', historyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 Server is running on port ${PORT}                        ║
║  📍 Health check: http://localhost:${PORT}/api/health       ║
╚════════════════════════════════════════════════════════════╝
  `);
});
