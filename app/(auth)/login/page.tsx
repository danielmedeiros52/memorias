'use client';

import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.redirect;
    } else {
      const data = await res.json();
      setError(data.error || 'Erro ao autenticar');
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold">Entrar</h1>
      <p className="text-sm text-slate-600 mt-1">Escolha o tipo de usuário e entre com e-mail e senha.</p>
      <form onSubmit={onSubmit} className="space-y-3 mt-4">
        <div>
          <label className="label" htmlFor="role">Tipo de usuário</label>
          <select name="role" id="role" className="input">
            <option value="FUNERARIA">Funerária</option>
            <option value="FAMILIA">Família</option>
          </select>
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
        <button className="btn w-full" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
