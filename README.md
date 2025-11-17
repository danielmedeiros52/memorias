# Memorial com QR Code (MVP)

MVP fullstack em Next.js para criação de memoriais digitais com QR Code. Funerárias criam memoriais e enviam convites; familiares completam conteúdo e visitantes acessam a página pública.

## Arquitetura
- **Next.js 14 (App Router, TypeScript)** com Tailwind para UI simples.
- **Prisma** como ORM (PostgreSQL). `lib/prisma.ts` centraliza a conexão.
- **Autenticação manual** com sessões assinadas em cookie (`lib/session.ts`) e senhas com `scrypt` (`lib/auth.ts`). Roles: `FUNERARIA` e `FAMILIA`.
- **Camada de domínio** exposta via route handlers e server actions:
  - Rotas de API em `app/api` para login, convite e logout.
  - Server actions nos dashboards para criar memorial, atualizar dados, incluir descendentes/fotos/dedicações.
- **Geração de QR Code** com a lib `qrcode` diretamente nas páginas de edição.

Estrutura de pastas principal:
- `app/` – páginas públicas e dashboards separados (`/dashboard/funeral-home`, `/dashboard/family`, `/m/[slug]`).
- `app/api/` – handlers de autenticação e convite.
- `lib/` – utilidades (Prisma, sessão, hashing).
- `prisma/` – schema do banco.
- `uploads/` – pasta reservada para futura troca de armazenamento (hoje usamos URL direta).

## Modelagem de dados (Prisma)
Local: `prisma/schema.prisma`
- `FuneralHome`: dados e login da funerária.
- `FamilyUser`: responsável pelo memorial.
- `Memorial`: informações do falecido, status, visibilidade, relations com funerária/família.
- `Descendant`, `Photo`, `Dedication`: coleções associadas ao memorial.
- `InviteToken`: token de convite para família completar cadastro.
- Enums: `Visibility`, `MemorialStatus`, `RelationshipDegree`.

## Rotas principais
### Frontend
- `/` – landing simples.
- `/login` – escolha de role e autenticação.
- `/invite/[token]` – fluxo do convite da família.
- `/dashboard/funeral-home` – painel da funerária (lista e criação de memoriais + link/QR).
- `/dashboard/family` – painel da família.
- `/dashboard/family/[id]` – edição do memorial, galeria, descendentes, dedicações e QR.
- `/m/[slug]` – página pública do memorial.
- `/mvp` – resumo do escopo do MVP.

### API / server actions
- `POST /api/auth/login` – autenticação por role.
- `POST /api/auth/logout` – limpa sessão.
- `POST /api/auth/complete-invite` – completa cadastro da família a partir do token.
- Server actions embarcadas nas páginas de dashboard para CRUD de memorial, descendentes, fotos (URL) e dedicações.

## Fluxos implementados
- **Funerária**: login → dashboard → cria memorial básico → gera token de convite e slug público → vê lista de memoriais e link de convite.
- **Família**: abre link `/invite/{token}` → define senha → dashboard com memoriais → edita dados, biografia, visibilidade → adiciona descendentes, fotos (URLs) e dedicações → baixa QR Code.
- **Visitante**: acessa `/m/{slug}` → vê dados públicos, biografia, descendentes, galeria e dedicações.

## QR Code
Na página `/dashboard/family/[id]` o QR Code é renderizado com `qrcode` apontando para a URL pública (`NEXT_PUBLIC_APP_URL/m/{slug}`) e oferece botão de download (PNG base64).

## Scripts
```bash
npm install
npm run prisma:migrate   # cria/atualiza schema
npm run dev              # modo desenvolvimento
```

## Passo a passo local
1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` e `SESSION_SECRET`.
2. Instale dependências: `npm install` (pode precisar configurar proxy para acessar o npm registry).
3. Rode as migrações: `npm run prisma:migrate`.
4. Inicie o dev server: `npm run dev`.
5. Crie registros iniciais direto no banco (funerária/família) ou usando Prisma Studio (`npx prisma studio`).

## Notas e extensões futuras
- Upload de arquivos atualmente usa campo de URL; a pasta `uploads/` está reservada para futura estratégia local ou S3.
- Pagamentos/plano não implementados (usar campo `status` do memorial como controle manual).
- Para envio de e-mails reais, conecte o `inviteToken` a um serviço de e-mail disparando o link `/invite/{token}`.
