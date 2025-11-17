import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(':');
  const derived = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(key, 'hex');
  return timingSafeEqual(derived, storedBuffer);
}
