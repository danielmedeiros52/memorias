'use client';
import { useState } from 'react';

export default function CreateMemorialForm({ funeralHomeId }: { funeralHomeId: number }) {
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [falecimento, setFalecimento] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [familiaEmail, setFamiliaEmail] = useState('');
  const [familiaNome, setFamiliaNome] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/memorials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_completo: nome,
        data_nascimento: nascimento,
        data_falecimento: falecimento,
        naturalidade,
        familiaEmail,
        familiaNome,
        funeralHomeId
      })
    });
    if (res.ok) {
      setMessage('Memorial criado. Convite gerado para a família.');
      setNome('');
      setNascimento('');
      setFalecimento('');
      setNaturalidade('');
      setFamiliaEmail('');
      setFamiliaNome('');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Erro ao criar memorial');
    }
  };

  return (
    <div className="card">
      <h2 className="font-semibold mb-3">Criar novo memorial</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Nome completo</label>
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Naturalidade</label>
          <input className="input" value={naturalidade} onChange={(e) => setNaturalidade(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Data de nascimento</label>
          <input className="input" type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Data de falecimento</label>
          <input className="input" type="date" value={falecimento} onChange={(e) => setFalecimento(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">E-mail do familiar</label>
          <input className="input" type="email" value={familiaEmail} onChange={(e) => setFamiliaEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Nome do familiar</label>
          <input className="input" value={familiaNome} onChange={(e) => setFamiliaNome(e.target.value)} />
        </div>
        <div className="md:col-span-2 flex gap-2 items-center">
          <button className="btn-primary" type="submit">Criar memorial</button>
          {message && <span className="text-sm text-slate-700">{message}</span>}
        </div>
      </form>
    </div>
  );
}
