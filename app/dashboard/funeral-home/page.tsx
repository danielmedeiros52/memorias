import prisma from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import { randomUUID } from 'crypto';
import Link from 'next/link';

async function createMemorial(formData: FormData) {
  'use server';
  const session = requireSession('FUNERARIA');
  const nomeCompleto = String(formData.get('nomeCompleto') || '');
  const emailResponsavel = String(formData.get('emailResponsavel') || '').toLowerCase();
  const dataNascimento = formData.get('dataNascimento') ? new Date(String(formData.get('dataNascimento'))) : null;
  const dataFalecimento = formData.get('dataFalecimento') ? new Date(String(formData.get('dataFalecimento'))) : null;
  const naturalidade = String(formData.get('naturalidade') || '');
  const slug = randomUUID();
  const inviteToken = randomUUID();

  const family = await prisma.familyUser.upsert({
    where: { email: emailResponsavel },
    update: { email: emailResponsavel, name: 'Responsável' },
    create: { email: emailResponsavel, name: 'Responsável' },
  });

  const memorial = await prisma.memorial.create({
    data: {
      slug,
      nomeCompleto,
      dataNascimento,
      dataFalecimento,
      naturalidade,
      funeralHomeId: session.userId,
      familyUserId: family.id,
    },
  });

  await prisma.inviteToken.create({
    data: {
      token: inviteToken,
      memorialId: memorial.id,
      familyUserId: family.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    },
  });
}

export default async function FuneralHomeDashboard() {
  const session = requireSession('FUNERARIA');
  const funeralHome = await prisma.funeralHome.findUnique({
    where: { id: session.userId },
    include: {
      memorials: {
        include: { family: true, invites: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel da funerária</h1>
          <p className="text-slate-600">Olá, {funeralHome?.name}. Crie memoriais e compartilhe o link com a família.</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="text-sm text-red-600" type="submit">Sair</button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold text-lg">Criar memorial</h2>
        <form action={createMemorial} className="grid md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="label" htmlFor="nomeCompleto">Nome completo</label>
            <input className="input" name="nomeCompleto" required />
          </div>
          <div>
            <label className="label" htmlFor="emailResponsavel">E-mail do responsável</label>
            <input className="input" type="email" name="emailResponsavel" required />
          </div>
          <div>
            <label className="label" htmlFor="dataNascimento">Data de nascimento</label>
            <input className="input" type="date" name="dataNascimento" />
          </div>
          <div>
            <label className="label" htmlFor="dataFalecimento">Data de falecimento</label>
            <input className="input" type="date" name="dataFalecimento" />
          </div>
          <div>
            <label className="label" htmlFor="naturalidade">Naturalidade</label>
            <input className="input" name="naturalidade" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn" type="submit">Criar memorial</button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Memoriais criados</h2>
        <div className="grid gap-3">
          {funeralHome?.memorials.map((memorial) => {
            const activeInvite = memorial.invites[0];
            return (
              <div key={memorial.id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{memorial.nomeCompleto}</h3>
                  <p className="text-sm text-slate-600">Status: {memorial.status}</p>
                  <p className="text-sm text-slate-600">Responsável: {memorial.family?.email || 'pendente'}</p>
                </div>
                <div className="text-sm space-y-1">
                  <Link className="btn" href={`/m/${memorial.slug}`}>Página pública</Link>
                  {activeInvite && (
                    <p className="text-xs text-slate-600">Convite: /invite/{activeInvite.token}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
