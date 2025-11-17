import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const memorial = await prisma.memorial.findUnique({ where: { id: Number(params.id) } });
  if (!memorial) return NextResponse.json({ error: 'Memorial não encontrado' }, { status: 404 });
  if (session.role === 'FAMILIA' && memorial.familyUserId !== session.id) return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });

  const { nome, grau_parentesco } = await req.json();
  const descendant = await prisma.descendant.create({ data: { memorialId: memorial.id, nome, grau_parentesco } });
  return NextResponse.json({ descendant });
}
