import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { config } from '../config.js';

const encode = value => Buffer.from(value).toString('base64url');
const safeCompare = (left, right) => timingSafeEqual(
  createHash('sha256').update(String(left)).digest(),
  createHash('sha256').update(String(right)).digest()
);

export function createAccessToken(email) {
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ sub: email, iat: now, exp: now + 60 * 60 * 8 }));
  const signature = createHmac('sha256', config.jwtSecret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyAccessToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expected = createHmac('sha256', config.jwtSecret).update(`${header}.${payload}`).digest('base64url');
  if (!safeCompare(signature, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!claims.sub || !Number.isFinite(claims.exp) || claims.exp <= Date.now() / 1000) return null;
    return claims;
  } catch {
    return null;
  }
}

export function verifyCredentials(email, password) {
  return safeCompare(String(email || '').trim().toLowerCase(), config.adminEmail.trim().toLowerCase())
    && safeCompare(String(password || ''), config.adminPassword);
}
