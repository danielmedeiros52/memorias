import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const memorial = await prisma.memorial.findUnique({ where: { id: Number(params.id) } });
  if (!memorial) return NextResponse.json({ error: 'Memorial não encontrado' }, { status: 404 });
  if (session.role === 'FAMILIA' && memorial.familyUserId !== session.id) return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });

  const uploadDir = process.env.UPLOAD_DIR || 'public/uploads';
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true, filename: (_name, _ext, part) => `${Date.now()}_${part.originalFilename}` });
  const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files.file as formidable.File;
  const relativePath = file.filepath.replace(path.join(process.cwd(), 'public'), '');
  const photo = await prisma.photo.create({
    data: {
      memorialId: memorial.id,
      url_arquivo: relativePath,
      legenda: (data.fields.legenda as string) || null,
      ordem: Number(data.fields.ordem || 0)
    }
  });

  return NextResponse.json({ photo });
}
