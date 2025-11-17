import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PublicList() {
  const memorials = await prisma.memorial.findMany({ where: { visibilidade: 'publico' }, select: { id: true, nome_completo: true, slug: true } });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Memoriais públicos</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {memorials.map((m) => (
          <div key={m.id} className="card">
            <h3 className="font-semibold">{m.nome_completo}</h3>
            <Link className="text-indigo-600 underline text-sm" href={`/m/${m.slug}`}>Abrir memorial</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
