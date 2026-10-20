import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// Health check endpoint (WD1 / Deployment health)
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

export default app;
