import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const memorials = await prisma.memorial.findMany({ where: { visibilidade: 'publico' }, select: { id: true, nome_completo: true, slug: true, status: true } });
  return NextResponse.json({ memorials });
}
