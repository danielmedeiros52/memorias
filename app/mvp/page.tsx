export default function MvpPage() {
  return (
    <div className="prose max-w-3xl">
      <h1>Sobre o MVP</h1>
      <p>Este MVP implementa o fluxo de memoriais digitais com QR Code, incluindo painéis separados para funerárias e famílias.</p>
      <ul>
        <li>Modelagem com Prisma e PostgreSQL</li>
        <li>Autenticação por role (FUNERARIA, FAMILIA)</li>
        <li>Dashboard para criação e edição de memoriais</li>
        <li>Página pública /m/[slug] para visitantes</li>
      </ul>
      <p>Veja o README para instruções de execução local.</p>
    </div>
  );
}
