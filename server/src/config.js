import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  clientOrigins: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(value => value.trim()).filter(Boolean),
  threshold: Number(process.env.QUALIFICATION_THRESHOLD) || 10000,
  currency: (process.env.QUALIFICATION_CURRENCY || 'USD').toUpperCase(),
  isProduction: process.env.NODE_ENV === 'production',
  adminEmail: process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? '' : 'admin@leadflow.local'),
  adminPassword: process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'leadflow-local-only'),
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-development-secret-change-this')
};
