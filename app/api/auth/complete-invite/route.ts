import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { setSession } from '@/lib/session';
import { addMinutes } from 'date-fns';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = String(formData.get('token') || '');
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '').toLowerCase();
  const password = String(formData.get('password') || '');

  if (!token || !email || !password) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  const invite = await prisma.inviteToken.findUnique({ include: { familyUser: true, memorial: true }, where: { token } });
  if (!invite || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Convite inválido ou expirado' }, { status: 400 });
  }

  const family = await prisma.familyUser.upsert({
    where: { email },
    update: { name, passwordHash: hashPassword(password) },
    create: { name, email, passwordHash: hashPassword(password) },
  });

  await prisma.memorial.update({
    where: { id: invite.memorialId },
    data: {
      familyUserId: family.id,
      status: 'ativo',
    },
  });

  await prisma.inviteToken.update({
    where: { id: invite.id },
    data: { expiresAt: addMinutes(new Date(), -1) },
  });

  setSession({ userId: family.id, role: 'FAMILIA', email: family.email, name: family.name });
  return NextResponse.json({ redirect: '/dashboard/family' });
}
