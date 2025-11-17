import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Memorial com QR Code</h1>
        <p className="text-slate-600 mt-2">
          MVP para criação de memoriais digitais conectados a QR Codes. Funerárias criam memoriais básicos,
          familiares completam e gerenciam, visitantes acessam a página pública.
        </p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <Link className="btn" href="/login">Acessar painel</Link>
          <Link className="btn bg-slate-800 hover:bg-slate-900" href="/mvp">Ver especificação</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-semibold text-lg">Para funerárias</h2>
          <p className="text-slate-600 text-sm mt-1">Crie memoriais rapidamente e gere links/QR Codes para as famílias.</p>
        </div>
        <div className="card">
          <h2 className="font-semibold text-lg">Para famílias</h2>
          <p className="text-slate-600 text-sm mt-1">Complete a biografia, fotos e homenagens em um painel seguro.</p>
        </div>
        <div className="card">
          <h2 className="font-semibold text-lg">Para visitantes</h2>
          <p className="text-slate-600 text-sm mt-1">Acesse o memorial público via URL ou QR Code.</p>
        </div>
      </div>
    </div>
  );
}
