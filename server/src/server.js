import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config.js';
import leadsRouter from './routes/leads.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: config.clientUrl.split(',').map(v => v.trim()), methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'memory mode' }));
app.use('/api/leads', leadsRouter);
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ success: false, error: status === 400 ? error.message : 'Something went wrong while processing the request.' });
});

if (config.mongoUri) {
  mongoose.connect(config.mongoUri).then(() => console.log('MongoDB connected')).catch(error => console.error('MongoDB unavailable; using in-memory storage:', error.message));
} else console.warn('MONGODB_URI is unset; using in-memory storage.');

app.listen(config.port, () => console.log(`Leadflow API listening on port ${config.port}`));
