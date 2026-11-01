import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  threshold: Number(process.env.QUALIFICATION_THRESHOLD) || 10000,
  currency: (process.env.QUALIFICATION_CURRENCY || 'USD').toUpperCase()
};
