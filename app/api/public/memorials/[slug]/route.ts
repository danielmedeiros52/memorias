import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const memorial = await prisma.memorial.findUnique({
    where: { slug: params.slug },
    include: { descendants: true, photos: true, dedications: { orderBy: { createdAt: 'desc' } } }
  });
  if (!memorial || memorial.visibilidade === 'privado') return NextResponse.json({ error: 'Memorial não encontrado' }, { status: 404 });
  return NextResponse.json({ memorial });
}
