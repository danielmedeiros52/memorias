import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import MemorialEditor from '@/components/MemorialEditor';
import { notFound } from 'next/navigation';

export default async function EditMemorial({ params }: { params: { id: string } }) {
  const session = await requireUser();
  if (!session) return <div>Não autorizado</div>;
  const memorial = await prisma.memorial.findUnique({ where: { id: Number(params.id) }, include: { descendants: true, photos: true, dedications: true } });
  if (!memorial) return notFound();
  if (session.role === 'FAMILIA' && memorial.familyUserId !== session.id) return <div>Sem acesso</div>;
  if (session.role === 'FUNERARIA' && memorial.funeralHomeId !== session.id) return <div>Sem acesso</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Editar memorial</h1>
      <MemorialEditor memorial={memorial} />
    </div>
  );
}
