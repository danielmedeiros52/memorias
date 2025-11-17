import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import type { Role } from '@prisma/client';

export async function GET() {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  if (session.role === 'FUNERARIA') {
    const memorials = await prisma.memorial.findMany({
      where: { funeralHomeId: session.id },
      include: { familyUser: true }
    });
    return NextResponse.json({ memorials });
  }

  const memorials = await prisma.memorial.findMany({ where: { familyUserId: session.id } });
  return NextResponse.json({ memorials });
}

export async function POST(req: NextRequest) {
  const session = await requireUser('FUNERARIA');
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const body = await req.json();
  const { nome_completo, data_nascimento, data_falecimento, naturalidade, familiaEmail, familiaNome } = body;

  if (!nome_completo || !data_nascimento || !data_falecimento || !familiaEmail) {
    return NextResponse.json({ error: 'Dados obrigatórios faltando' }, { status: 400 });
  }

  let familyUser = await prisma.familyUser.findUnique({ where: { email: familiaEmail } });
  if (!familyUser) {
    const hashed = await bcrypt.hash(randomUUID(), 10);
    familyUser = await prisma.familyUser.create({
      data: { email: familiaEmail, name: familiaNome || 'Familiar', password: hashed }
    });
  }

  const slug = randomUUID();
  const memorial = await prisma.memorial.create({
    data: {
      slug,
      nome_completo,
      data_nascimento: new Date(data_nascimento),
      data_falecimento: new Date(data_falecimento),
      naturalidade,
      funeralHomeId: session.id,
      familyUserId: familyUser.id,
      status: 'pendente_dados_familia'
    }
  });

  await prisma.inviteToken.create({
    data: {
      token: randomUUID(),
      memorialId: memorial.id,
      familyUserId: familyUser.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }
  });

  return NextResponse.json({ memorial });
}
