import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const memorial = await prisma.memorial.findUnique({
    where: { id: Number(params.id) },
    include: { descendants: true, photos: true, dedications: true, familyUser: true, funeralHome: true }
  });
  if (!memorial) return NextResponse.json({ error: 'Memorial não encontrado' }, { status: 404 });
  if (session.role === 'FAMILIA' && memorial.familyUserId !== session.id) return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
  if (session.role === 'FUNERARIA' && memorial.funeralHomeId !== session.id) return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
  return NextResponse.json({ memorial });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const memorial = await prisma.memorial.findUnique({ where: { id: Number(params.id) } });
  if (!memorial) return NextResponse.json({ error: 'Memorial não encontrado' }, { status: 404 });
  if (session.role === 'FAMILIA' && memorial.familyUserId !== session.id) return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });

  const body = await req.json();
  const updated = await prisma.memorial.update({ where: { id: memorial.id }, data: body });
  return NextResponse.json({ memorial: updated });
}
