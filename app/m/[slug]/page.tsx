import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PublicMemorial({ params }: { params: { slug: string } }) {
  const memorial = await prisma.memorial.findUnique({
    where: { slug: params.slug },
    include: { descendants: true, photos: true, dedications: true },
  });

  if (!memorial) notFound();
  if (memorial.visibilidade === 'privado') {
    return <div className="card">Este memorial é privado.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-3xl font-semibold">{memorial.nomeCompleto}</h1>
        <p className="text-slate-600">{memorial.naturalidade}</p>
        <p className="text-slate-600 text-sm">
          {memorial.dataNascimento?.toLocaleDateString()} - {memorial.dataFalecimento?.toLocaleDateString()}
        </p>
        <p className="text-slate-700 mt-2">Filiação: {memorial.filiacao}</p>
        <div className="mt-4 space-y-2">
          <h2 className="font-semibold text-lg">Biografia</h2>
          <p className="whitespace-pre-wrap text-slate-700">{memorial.biografia}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold">Descendentes</h3>
          <ul className="text-sm text-slate-700 mt-2 space-y-1">
            {memorial.descendants.map((d) => (
              <li key={d.id}>{d.grauParentesco}: {d.nome}</li>
            ))}
          </ul>
        </div>
        <div className="card md:col-span-2">
          <h3 className="font-semibold">Galeria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {memorial.photos.map((p) => (
              <div key={p.id}>
                <img src={p.urlArquivo} alt={p.legenda || 'Foto'} className="w-full h-32 object-cover rounded" />
                <p className="text-xs text-slate-600">{p.legenda}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold">Dedicações</h3>
        <div className="space-y-2 mt-2">
          {memorial.dedications.map((d) => (
            <div key={d.id} className="border-b pb-2">
              <p className="font-semibold">{d.autorNome}</p>
              <p className="text-slate-700">{d.mensagem}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
