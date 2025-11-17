'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@prisma/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('FUNERARIA');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (res.ok) {
      router.push(role === 'FUNERARIA' ? '/dashboard/funeral-home' : '/dashboard/family');
    } else {
      const data = await res.json();
      setError(data.error || 'Erro ao logar');
    }
  };

  return (
    <div className="max-w-xl mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm">E-mail</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex gap-4 items-center text-sm">
          <label className="font-medium">Sou:</label>
          <label className="flex items-center gap-1"><input type="radio" checked={role === 'FUNERARIA'} onChange={() => setRole('FUNERARIA')} />Funerária</label>
          <label className="flex items-center gap-1"><input type="radio" checked={role === 'FAMILIA'} onChange={() => setRole('FAMILIA')} />Família</label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary" type="submit">Entrar</button>
      </form>
    </div>
  );
}
