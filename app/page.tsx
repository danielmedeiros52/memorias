import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">Bem-vindo ao MVP</h1>
        <p className="text-slate-700">Crie e gerencie memoriais digitais conectados a QR Codes.</p>
        <div className="mt-4 flex gap-3">
          <Link className="btn-primary" href="/login">Acessar login</Link>
          <Link className="btn-secondary" href="/m">Ver memoriais públicos</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-2">Funerárias</h2>
          <p className="text-sm text-slate-700">Cadastre memoriais rapidamente e entregue o link/QR Code para a família completar.</p>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Famílias</h2>
          <p className="text-sm text-slate-700">Complete biografia, fotos e dedicatórias de forma simples.</p>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Visitantes</h2>
          <p className="text-sm text-slate-700">Acesse o memorial público via QR Code ou URL.</p>
        </div>
      </div>
    </div>
  );
}
