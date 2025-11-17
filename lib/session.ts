import { cookies } from 'next/headers';
import { createHmac } from 'crypto';
import { redirect } from 'next/navigation';

type Role = 'FUNERARIA' | 'FAMILIA';

export type SessionPayload = {
  userId: string;
  role: Role;
  email: string;
  name?: string;
};

const secret = process.env.SESSION_SECRET || 'dev-secret';

function signPayload(payload: SessionPayload) {
  const data = JSON.stringify(payload);
  const signature = createHmac('sha256', secret).update(data).digest('hex');
  const token = Buffer.from(data).toString('base64url');
  return `${token}.${signature}`;
}

function parseToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) return null;
  const data = Buffer.from(payloadPart, 'base64url').toString();
  const expected = createHmac('sha256', secret).update(data).digest('hex');
  if (expected !== signature) return null;
  return JSON.parse(data) as SessionPayload;
}

export function setSession(payload: SessionPayload) {
  const token = signPayload(payload);
  cookies().set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSession() {
  cookies().delete('session');
}

export function getSession(): SessionPayload | null {
  const token = cookies().get('session')?.value;
  return parseToken(token);
}

export function requireSession(role?: Role): SessionPayload {
  const session = getSession();
  if (!session) redirect('/login');
  if (role && session.role !== role) redirect('/login');
  return session;
}
