import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { createAccessToken, verifyCredentials } from '../services/auth.js';

const router = Router();
const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(200) });

router.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success || !verifyCredentials(parsed.data?.email, parsed.data?.password)) {
    return res.status(401).json({ success: false, error: 'Email or password is incorrect.' });
  }
  return res.json({ success: true, token: createAccessToken(config.adminEmail), user: { email: config.adminEmail } });
});

export default router;
