import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { token, name, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: 'Dados faltando' }, { status: 400 });

  const invite = await prisma.inviteToken.findUnique({ where: { token }, include: { familyUser: true, memorial: true } });
  if (!invite || invite.accepted || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Convite inválido' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const familyUser = await prisma.familyUser.update({
    where: { id: invite.familyUserId },
    data: { password: hashed, name: name || invite.familyUser.name }
  });

  await prisma.inviteToken.update({ where: { id: invite.id }, data: { accepted: true } });
  await prisma.memorial.update({ where: { id: invite.memorialId }, data: { status: 'ativo' } });

  const jwt = signToken({ id: familyUser.id, email: familyUser.email, role: 'FAMILIA', name: familyUser.name });
  setAuthCookie(jwt);
  return NextResponse.json({ success: true, memorialId: invite.memorialId });
}
