'use client';
import { useState } from 'react';
import type { Memorial, Descendant, Photo, Dedication } from '@prisma/client';

interface Props {
  memorial: Memorial & { descendants: Descendant[]; photos: Photo[]; dedications: Dedication[] };
}

export default function MemorialEditor({ memorial }: Props) {
  const [bio, setBio] = useState(memorial.biografia || '');
  const [naturalidade, setNaturalidade] = useState(memorial.naturalidade || '');
  const [filiacao, setFiliacao] = useState(memorial.filiacao || '');
  const [visibilidade, setVisibilidade] = useState(memorial.visibilidade);
  const [descNome, setDescNome] = useState('');
  const [descGrau, setDescGrau] = useState('');
  const [dedAutor, setDedAutor] = useState('');
  const [dedMensagem, setDedMensagem] = useState('');
  const [message, setMessage] = useState('');

  const saveInfo = async () => {
    const res = await fetch(`/api/memorials/${memorial.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ biografia: bio, naturalidade, filiacao, visibilidade })
    });
    setMessage(res.ok ? 'Dados salvos' : 'Erro ao salvar');
  };

  const addDesc = async () => {
    const res = await fetch(`/api/memorials/${memorial.id}/descendants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: descNome, grau_parentesco: descGrau })
    });
    setMessage(res.ok ? 'Descendente adicionado' : 'Erro');
    setDescNome('');
    setDescGrau('');
  };

  const addDedication = async () => {
    const res = await fetch(`/api/memorials/${memorial.id}/dedications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor_nome: dedAutor || 'Visitante', mensagem: dedMensagem })
    });
    setMessage(res.ok ? 'Mensagem adicionada' : 'Erro');
    setDedAutor('');
    setDedMensagem('');
  };

  const uploadPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/memorials/${memorial.id}/photos`, { method: 'POST', body: formData });
    setMessage(res.ok ? 'Foto enviada' : 'Erro ao enviar foto');
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h2 className="font-semibold">Informações</h2>
        <label className="text-sm">Naturalidade</label>
        <input className="input" value={naturalidade} onChange={(e) => setNaturalidade(e.target.value)} />
        <label className="text-sm">Filiação</label>
        <input className="input" value={filiacao} onChange={(e) => setFiliacao(e.target.value)} />
        <label className="text-sm">Biografia</label>
        <textarea className="input h-32" value={bio} onChange={(e) => setBio(e.target.value)} />
        <label className="text-sm">Visibilidade</label>
        <select className="input" value={visibilidade} onChange={(e) => setVisibilidade(e.target.value as any)}>
          <option value="publico">Público</option>
          <option value="privado">Privado</option>
        </select>
        <button className="btn-primary" type="button" onClick={saveInfo}>Salvar</button>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Descendentes</h2>
        <div className="space-y-2">
          {memorial.descendants.map((d) => (
            <div key={d.id} className="text-sm">{d.nome} - {d.grau_parentesco}</div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          <input className="input" placeholder="Nome" value={descNome} onChange={(e) => setDescNome(e.target.value)} />
          <input className="input" placeholder="Grau de parentesco" value={descGrau} onChange={(e) => setDescGrau(e.target.value)} />
        </div>
        <button className="btn-secondary" type="button" onClick={addDesc}>Adicionar</button>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Fotos (máx 10)</h2>
        <div className="grid grid-cols-3 gap-2">
          {memorial.photos.map((p) => (
            <div key={p.id} className="text-xs">
              <img src={p.url_arquivo} alt={p.legenda || ''} className="rounded" />
              {p.legenda}
            </div>
          ))}
        </div>
        <form onSubmit={uploadPhoto} className="space-y-2">
          <input type="file" name="file" className="input" required />
          <input type="text" name="legenda" placeholder="Legenda" className="input" />
          <input type="number" name="ordem" placeholder="Ordem" className="input" />
          <button className="btn-secondary" type="submit">Enviar foto</button>
        </form>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Dedicatórias</h2>
        <div className="space-y-1 text-sm">
          {memorial.dedications.map((d) => (
            <div key={d.id} className="border-b pb-1">
              <div className="font-semibold">{d.autor_nome}</div>
              <div>{d.mensagem}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          <input className="input" placeholder="Seu nome" value={dedAutor} onChange={(e) => setDedAutor(e.target.value)} />
          <input className="input" placeholder="Mensagem" value={dedMensagem} onChange={(e) => setDedMensagem(e.target.value)} />
        </div>
        <button className="btn-secondary" type="button" onClick={addDedication}>Adicionar</button>
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}
