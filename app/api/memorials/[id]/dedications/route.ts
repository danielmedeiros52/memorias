import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const memorial = await prisma.memorial.findUnique({ where: { id: Number(params.id) } });
  if (!memorial) return NextResponse.json({ error: 'Memorial não encontrado' }, { status: 404 });
  const { autor_nome, mensagem } = await req.json();
  const dedication = await prisma.dedication.create({ data: { memorialId: memorial.id, autor_nome, mensagem } });
  return NextResponse.json({ dedication });
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dedications = await prisma.dedication.findMany({ where: { memorialId: Number(params.id) }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ dedications });
}
