'use client';

import { useState, FormEvent } from 'react';

export default function InvitePage({ params }: { params: { token: string } }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('token', params.token);
    const res = await fetch('/api/auth/complete-invite', { method: 'POST', body: formData });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.redirect;
    } else {
      const data = await res.json();
      setError(data.error || 'Erro ao salvar');
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold">Convite para completar memorial</h1>
      <p className="text-sm text-slate-600 mt-1">Defina seus dados para assumir o memorial.</p>
      <form onSubmit={onSubmit} className="space-y-3 mt-4">
        <div>
          <label className="label" htmlFor="name">Nome</label>
          <input className="input" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input className="input" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Senha</label>
          <input className="input" name="password" type="password" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar e acessar'}</button>
      </form>
    </div>
  );
}
