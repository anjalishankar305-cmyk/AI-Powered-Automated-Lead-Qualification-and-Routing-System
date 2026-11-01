import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  contactName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  rawText: { type: String, required: true, trim: true, maxlength: 10000 },
  companyName: { type: String, default: 'Not provided', trim: true },
  estimatedBudget: { type: Number, default: null, min: 0 },
  currency: { type: String, default: 'USD', uppercase: true },
  urgency: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'], default: 'UNKNOWN' },
  summary: { type: String, required: true, maxlength: 1000 },
  tier: { type: String, enum: ['ENTERPRISE', 'UNQUALIFIED', 'NEEDS_REVIEW'], required: true },
  routingStatus: { type: String, enum: ['ASSIGNED_ACCOUNT_EXEC', 'AUTO_NURTURE', 'MANUAL_REVIEW'], required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
