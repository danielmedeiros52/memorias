import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { setSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get('email') || '').toLowerCase();
  const password = String(formData.get('password') || '');
  const role = formData.get('role') === 'FUNERARIA' ? 'FUNERARIA' : 'FAMILIA';

  if (!email || !password) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  if (role === 'FUNERARIA') {
    const funeral = await prisma.funeralHome.findUnique({ where: { email } });
    if (!funeral || !verifyPassword(password, funeral.passwordHash)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
    setSession({ userId: funeral.id, role: 'FUNERARIA', email: funeral.email, name: funeral.name });
    return NextResponse.json({ redirect: '/dashboard/funeral-home' });
  }

  const family = await prisma.familyUser.findUnique({ where: { email } });
  if (!family || !family.passwordHash || !verifyPassword(password, family.passwordHash)) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }
  setSession({ userId: family.id, role: 'FAMILIA', email: family.email, name: family.name });
  return NextResponse.json({ redirect: '/dashboard/family' });
}
