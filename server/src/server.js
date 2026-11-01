import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config.js';
import leadsRouter from './routes/leads.js';
import authRouter from './routes/auth.js';
import requireAuth from './middleware/requireAuth.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: config.clientOrigins, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  const healthy = !config.isProduction || connected;
  return res.status(healthy ? 200 : 503).json({ success: healthy, database: connected ? 'connected' : 'unavailable' });
});
app.use('/api/auth', authRouter);
app.use('/api/leads', requireAuth, leadsRouter);
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ success: false, error: status === 400 ? error.message : 'Something went wrong while processing the request.' });
});

async function start() {
  if (config.isProduction) {
    if (!config.mongoUri) throw new Error('MONGODB_URI must be configured in production.');
    if (!config.adminEmail || !config.adminPassword || config.adminPassword.length < 12) {
      throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in production.');
    }
    if (config.jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }

  if (config.mongoUri) {
    try {
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 15000 });
      console.log('MongoDB connected');
    } catch (error) {
      if (config.isProduction) throw error;
      console.error('MongoDB unavailable; using in-memory storage:', error.message);
    }
  } else {
    console.warn('MONGODB_URI is unset; using in-memory storage (development only).');
  }

  app.listen(config.port, '0.0.0.0', () => console.log(`Leadflow API listening on port ${config.port}`));
}

start().catch(error => {
  console.error('Leadflow API failed to start:', error.message);
  process.exit(1);
});
