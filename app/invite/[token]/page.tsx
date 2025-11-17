'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InvitePage({ params }: { params: { token: string } }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/invite/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, name, password })
    });
    if (res.ok) {
      const data = await res.json();
      setMessage('Cadastro finalizado! Redirecionando...');
      setTimeout(() => router.push(`/memorials/${data.memorialId}/edit`), 1000);
    } else {
      const data = await res.json();
      setMessage(data.error || 'Erro ao aceitar convite');
    }
  };

  return (
    <div className="max-w-lg mx-auto card space-y-3">
      <h1 className="text-xl font-semibold">Convite para editar memorial</h1>
      <p className="text-sm text-slate-700">Defina seu nome e uma senha para concluir o cadastro.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="input" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary" type="submit">Concluir</button>
      </form>
      {message && <p className="text-sm text-slate-700">{message}</p>}
    </div>
  );
}
