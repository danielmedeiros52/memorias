import prisma from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';

export default async function FamilyDashboard() {
  const session = requireSession('FAMILIA');
  const family = await prisma.familyUser.findUnique({
    where: { id: session.userId },
    include: { memorials: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Memoriais da família</h1>
          <p className="text-slate-600">Olá, {family?.name}. Clique em um memorial para editar.</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="text-sm text-red-600" type="submit">Sair</button>
        </form>
      </div>
      <div className="grid gap-3">
        {family?.memorials.map((memorial) => (
          <Link key={memorial.id} href={`/dashboard/family/${memorial.id}`} className="card block">
            <h2 className="font-semibold">{memorial.nomeCompleto}</h2>
            <p className="text-sm text-slate-600">Status: {memorial.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
