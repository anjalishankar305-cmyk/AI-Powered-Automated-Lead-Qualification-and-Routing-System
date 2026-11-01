import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { processLead } from '../services/leadProcessor.js';

const router = Router();
const memoryLeads = [];
const inputSchema = z.object({
  contactName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  rawText: z.string().trim().min(10).max(10000),
  companyName: z.string().trim().max(200).optional().or(z.literal(''))
});
const useMongo = () => mongoose.connection.readyState === 1;
const sortNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

router.post('/', async (req, res, next) => {
  const parsed = inputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Please check the contact details and inquiry text.', details: parsed.error.flatten().fieldErrors });
  try {
    const processed = await processLead(parsed.data);
    const lead = useMongo() ? await Lead.create(processed) : { ...processed, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    if (!useMongo()) memoryLeads.unshift(lead);
    return res.status(201).json({ success: true, lead });
  } catch (error) { return next(error); }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const leads = useMongo() ? await Lead.find().lean() : memoryLeads;
    return res.json({ success: true, stats: {
      total: leads.length,
      enterprise: leads.filter(l => l.tier === 'ENTERPRISE').length,
      unqualified: leads.filter(l => l.tier === 'UNQUALIFIED').length,
      needsReview: leads.filter(l => l.tier === 'NEEDS_REVIEW').length,
      highUrgency: leads.filter(l => l.urgency === 'HIGH').length
    } });
  } catch (error) { return next(error); }
});

router.get('/enterprise', async (req, res, next) => {
  try {
    const leads = useMongo() ? await Lead.find({ tier: 'ENTERPRISE' }).sort({ createdAt: -1 }).lean() : memoryLeads.filter(l => l.tier === 'ENTERPRISE').sort(sortNewest);
    return res.json({ success: true, leads });
  } catch (error) { return next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const { search = '', tier = '', urgency = '', status = '' } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const regex = search ? new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
    const filter = {};
    if (tier) filter.tier = tier;
    if (urgency) filter.urgency = urgency;
    if (status) filter.routingStatus = status;
    if (regex) filter.$or = [{ contactName: regex }, { companyName: regex }, { email: regex }, { summary: regex }];
    let leads, total;
    if (useMongo()) {
      [leads, total] = await Promise.all([Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Lead.countDocuments(filter)]);
    } else {
      const filtered = memoryLeads.filter(l => (!tier || l.tier === tier) && (!urgency || l.urgency === urgency) && (!status || l.routingStatus === status) && (!search || [l.contactName, l.companyName, l.email, l.summary].some(v => regex.test(v || '')))).sort(sortNewest);
      total = filtered.length; leads = filtered.slice((page - 1) * limit, page * limit);
    }
    return res.json({ success: true, leads, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const lead = useMongo() ? (mongoose.isValidObjectId(req.params.id) ? await Lead.findById(req.params.id).lean() : null) : memoryLeads.find(l => l._id === req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found.' });
    return res.json({ success: true, lead });
  } catch (error) { return next(error); }
});

export default router;
