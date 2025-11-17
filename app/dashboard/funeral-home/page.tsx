import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import Link from 'next/link';
import CreateMemorialForm from '@/components/CreateMemorialForm';

export default async function FuneralDashboard() {
  const user = await requireUser('FUNERARIA');
  if (!user) return <div>Não autorizado</div>;
  const memorials = await prisma.memorial.findMany({ where: { funeralHomeId: user.id }, include: { familyUser: true } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard da Funerária</h1>
          <p className="text-sm text-slate-600">Memoriais criados por você.</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="btn-secondary" type="submit">Sair</button>
        </form>
      </div>
      <CreateMemorialForm funeralHomeId={user.id} />
      <div className="grid md:grid-cols-2 gap-4">
        {memorials.map((m) => (
          <div key={m.id} className="card">
            <h3 className="font-semibold">{m.nome_completo}</h3>
            <p className="text-sm">Responsável: {m.familyUser?.email}</p>
            <p className="text-sm">Status: {m.status}</p>
            <div className="mt-2 flex gap-2">
              <Link className="btn-secondary text-sm" href={`/memorials/${m.id}/edit`}>Detalhes</Link>
              <Link className="btn-secondary text-sm" href={`/m/${m.slug}`} target="_blank">Página pública</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
