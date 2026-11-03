import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'mongo-sanitize';
import authRoutes from './routes/auth.js';
import giveawayRoutes from './routes/giveaways.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json({ limit: '10kb' }));

// Mongo injection sanitization
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.params) req.params = mongoSanitize(req.params);
  next();
});

// General rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    status: 'error',
    code: 'RATE_LIMITED',
    message: 'Too many attempts. Please wait a moment.'
  }
});
app.use('/api', limiter);

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'veloop-giveaway-api',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'veloop-giveaway-api',
    serverTime: new Date().toISOString()
  });
});

// Mount domain routes
app.use('/api/auth', authRoutes);
app.use('/api/giveaways', giveawayRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
