import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL obrigatória' }, { status: 400 });
  const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 1 });
  const base64 = dataUrl.split(',')[1];
  const buffer = Buffer.from(base64, 'base64');
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qr.png"'
    }
  });
}
