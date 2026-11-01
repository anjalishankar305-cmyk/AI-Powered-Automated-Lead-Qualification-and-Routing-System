import { verifyAccessToken } from '../services/auth.js';

export default function requireAuth(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const claims = verifyAccessToken(token);
  if (!claims) return res.status(401).json({ success: false, error: 'Please sign in to access lead management.' });
  req.user = { email: claims.sub };
  return next();
}
