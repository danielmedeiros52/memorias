import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';

export default async function PublicMemorial({ params }: { params: { slug: string } }) {
  const memorial = await prisma.memorial.findUnique({
    where: { slug: params.slug },
    include: { descendants: true, photos: true, dedications: { orderBy: { createdAt: 'desc' } } }
  });
  if (!memorial || memorial.visibilidade === 'privado') return notFound();
  const qrData = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/m/${params.slug}`);
  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-3xl font-bold">{memorial.nome_completo}</h1>
        <p className="text-sm text-slate-700">{new Date(memorial.data_nascimento).toLocaleDateString()} - {new Date(memorial.data_falecimento).toLocaleDateString()}</p>
        {memorial.naturalidade && <p className="text-sm">Naturalidade: {memorial.naturalidade}</p>}
        {memorial.filiacao && <p className="text-sm">Filiação: {memorial.filiacao}</p>}
        {memorial.biografia && <p className="mt-3 whitespace-pre-line">{memorial.biografia}</p>}
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Descendentes</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          {memorial.descendants.map((d) => <li key={d.id}>{d.nome} - {d.grau_parentesco}</li>)}
        </ul>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Galeria</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {memorial.photos.map((p) => (
            <div key={p.id}>
              <img src={p.url_arquivo} alt={p.legenda || ''} className="rounded" />
              {p.legenda && <p className="text-xs">{p.legenda}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Dedicatórias</h2>
        <div className="space-y-2 text-sm">
          {memorial.dedications.map((d) => (
            <div key={d.id} className="border-b pb-1">
              <div className="font-semibold">{d.autor_nome}</div>
              <div>{d.mensagem}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold">QR Code para este memorial</h2>
        <img src={qrData} alt="QR code" className="w-40 h-40" />
        <p className="text-sm text-slate-600">Use o botão de salvar imagem do navegador para baixar.</p>
      </div>
    </div>
  );
}
