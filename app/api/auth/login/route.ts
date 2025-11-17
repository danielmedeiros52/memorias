import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signToken, setAuthCookie } from '@/lib/auth';
import type { Role } from '@prisma/client';

type LoginBody = { email: string; password: string; role: Role };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginBody;
  const { email, password, role } = body;
  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 });
  }

  const user = role === 'FUNERARIA'
    ? await prisma.funeralHome.findUnique({ where: { email } })
    : await prisma.familyUser.findUnique({ where: { email } });

  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });

  const token = signToken({
    id: user.id,
    role,
    email: user.email,
    name: 'name' in user ? user.name : undefined
  });
  setAuthCookie(token);
  return NextResponse.json({ success: true });
}
