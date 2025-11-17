import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import type { Role } from '@prisma/client';

export type SessionUser = {
  id: number;
  role: Role;
  email: string;
  name?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function signToken(user: SessionUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete('token');
}

export function getSessionUser(): SessionUser | null {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch (err) {
    return null;
  }
}

export async function requireUser(role?: Role) {
  const session = getSessionUser();
  if (!session) return null;
  if (role && session.role !== role) return null;
  return session;
}

export async function findUserByEmail(email: string, role: Role) {
  if (role === 'FUNERARIA') return prisma.funeralHome.findUnique({ where: { email } });
  return prisma.familyUser.findUnique({ where: { email } });
}
