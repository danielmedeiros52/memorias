import prisma from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import QRCode from 'qrcode';
import { redirect } from 'next/navigation';

async function updateMemorial(id: string, formData: FormData) {
  'use server';
  const session = requireSession('FAMILIA');
  const memorial = await prisma.memorial.findFirst({ where: { id, familyUserId: session.userId } });
  if (!memorial) redirect('/dashboard/family');

  await prisma.memorial.update({
    where: { id },
    data: {
      naturalidade: String(formData.get('naturalidade') || ''),
      filiacao: String(formData.get('filiacao') || ''),
      biografia: String(formData.get('biografia') || ''),
      visibilidade: formData.get('visibilidade') === 'privado' ? 'privado' : 'publico',
      status: 'ativo',
    },
  });
}

async function addDescendant(id: string, formData: FormData) {
  'use server';
  const session = requireSession('FAMILIA');
  const memorial = await prisma.memorial.findFirst({ where: { id, familyUserId: session.userId } });
  if (!memorial) redirect('/dashboard/family');
  await prisma.descendant.create({
    data: {
      memorialId: id,
      nome: String(formData.get('nome') || ''),
      grauParentesco: (formData.get('grau') as any) || 'outro',
    },
  });
}

async function addPhoto(id: string, formData: FormData) {
  'use server';
  const session = requireSession('FAMILIA');
  const memorial = await prisma.memorial.findFirst({ where: { id, familyUserId: session.userId } });
  if (!memorial) redirect('/dashboard/family');
  const count = await prisma.photo.count({ where: { memorialId: id } });
  if (count >= 10) return;
  await prisma.photo.create({
    data: {
      memorialId: id,
      urlArquivo: String(formData.get('url') || ''),
      legenda: String(formData.get('legenda') || ''),
      ordem: count,
    },
  });
}

async function addDedication(id: string, formData: FormData) {
  'use server';
  const memorial = await prisma.memorial.findUnique({ where: { id } });
  if (!memorial) redirect('/dashboard/family');
  await prisma.dedication.create({
    data: {
      memorialId: id,
      autorNome: String(formData.get('autorNome') || ''),
      mensagem: String(formData.get('mensagem') || ''),
    },
  });
}

export default async function MemorialPage({ params }: { params: { id: string } }) {
  const session = requireSession('FAMILIA');
  const memorial = await prisma.memorial.findFirst({
    where: { id: params.id, familyUserId: session.userId },
    include: { descendants: true, photos: true, dedications: true },
  });

  if (!memorial) redirect('/dashboard/family');

  const qrData = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/m/${memorial.slug}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar memorial de {memorial.nomeCompleto}</h1>
        <p className="text-slate-600">Atualize dados, familiares e conteúdo visível ao público.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-lg">Dados do falecido</h2>
          <form action={(formData) => updateMemorial(memorial.id, formData)} className="space-y-3 mt-3">
            <div>
              <label className="label">Naturalidade</label>
              <input className="input" name="naturalidade" defaultValue={memorial.naturalidade || ''} />
            </div>
            <div>
              <label className="label">Filiação</label>
              <input className="input" name="filiacao" defaultValue={memorial.filiacao || ''} />
            </div>
            <div>
              <label className="label">Biografia</label>
              <textarea className="input min-h-[120px]" name="biografia" defaultValue={memorial.biografia || ''} />
            </div>
            <div>
              <label className="label">Visibilidade</label>
              <select className="input" name="visibilidade" defaultValue={memorial.visibilidade}>
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
              </select>
            </div>
            <button className="btn" type="submit">Salvar</button>
          </form>
        </div>
        <div className="card">
          <h2 className="font-semibold text-lg">QR Code</h2>
          <p className="text-sm text-slate-600">Escaneie ou faça download para plaquinhas.</p>
          <div className="mt-3">
            <img src={qrData} alt="QR Code" className="w-48 h-48" />
            <a className="btn mt-3" download={`qr-${memorial.slug}.png`} href={qrData}>Baixar PNG</a>
          </div>
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
          <form action={(formData) => addDescendant(memorial.id, formData)} className="space-y-2 mt-3">
            <input className="input" name="nome" placeholder="Nome" required />
            <select className="input" name="grau">
              <option value="filho">Filho</option>
              <option value="filha">Filha</option>
              <option value="neto">Neto</option>
              <option value="neta">Neta</option>
              <option value="bisneto">Bisneto</option>
              <option value="bisneta">Bisneta</option>
              <option value="outro">Outro</option>
            </select>
            <button className="btn w-full" type="submit">Adicionar</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold">Fotos (URL)</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {memorial.photos.map((p) => (
              <div key={p.id} className="text-sm">
                <img src={p.urlArquivo} alt={p.legenda || 'Foto'} className="w-full h-24 object-cover rounded" />
                <p className="text-xs text-slate-600">{p.legenda}</p>
              </div>
            ))}
          </div>
          <form action={(formData) => addPhoto(memorial.id, formData)} className="space-y-2 mt-3">
            <input className="input" name="url" placeholder="URL da foto" required />
            <input className="input" name="legenda" placeholder="Legenda" />
            <button className="btn w-full" type="submit">Adicionar</button>
            <p className="text-xs text-slate-600">Limite de 10 fotos.</p>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold">Dedicações</h3>
          <ul className="text-sm text-slate-700 mt-2 space-y-2">
            {memorial.dedications.map((d) => (
              <li key={d.id} className="border-b pb-2">
                <p className="font-semibold">{d.autorNome}</p>
                <p>{d.mensagem}</p>
              </li>
            ))}
          </ul>
          <form action={(formData) => addDedication(memorial.id, formData)} className="space-y-2 mt-3">
            <input className="input" name="autorNome" placeholder="Seu nome" required />
            <textarea className="input min-h-[80px]" name="mensagem" placeholder="Mensagem" required />
            <button className="btn w-full" type="submit">Publicar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
