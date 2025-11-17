# Memorial com QR Code (MVP)

MVP full-stack em Next.js para criar memoriais digitais conectados a QR Codes. Suporta fluxos de funerária, família e visitante com autenticação simples, convites, edição de memorial e exibição pública.

## Arquitetura
- **Next.js 14 (App Router)** com TypeScript, Tailwind.
- **Prisma** como ORM (PostgreSQL por padrão, ajustável via `DATABASE_URL`).
- **Autenticação** manual via JWT armazenado em cookie httpOnly, com roles `FUNERARIA` e `FAMILIA`.
- **Camadas**: `app/` para páginas/handlers, `lib/` para utilidades, `components/` para UI, `prisma/` para schema.
- **Uploads** simples em disco (`public/uploads`) via `formidable`, facilmente substituível por S3.

## Modelagem (Prisma)
- `FuneralHome`: login da funerária.
- `FamilyUser`: responsável da família.
- `Memorial`: dados do falecido, visibilidade, status, relações com funeral/família.
- `Descendant`, `Photo`, `Dedication`: dados complementares do memorial.
- `InviteToken`: controla convites e onboarding do familiar.

## Rotas principais
- **Autenticação**: `POST /api/auth/login`, `POST /api/auth/logout`.
- **Convite**: `POST /api/invite/accept` finaliza cadastro.
- **Memoriais**: `GET/POST /api/memorials`, `GET/PATCH /api/memorials/[id]`, filhos `/descendants`, `/photos`, `/dedications`.
- **Público**: `GET /api/public/memorials`, `GET /api/public/memorials/[slug]`, página `/m/{slug}`.
- **QR**: `POST /api/qr` gera PNG do QR Code.

Front-end:
- `/login` com seleção de role.
- Dashboards: `/dashboard/funeral-home`, `/dashboard/family`.
- Edição do memorial: `/memorials/{id}/edit`.
- Página pública: `/m/{slug}` (abre também via QR).
- Convite: `/invite/{token}`.

## Como rodar
1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL`, `JWT_SECRET` e `NEXT_PUBLIC_APP_URL`.
2. Instale dependências: `npm install`.
3. Rode migrações Prisma: `npx prisma migrate dev`.
4. Inicie o dev server: `npm run dev` (http://localhost:3000).

Crie manualmente usuários iniciais via `prisma studio` ou comandos Prisma.

Uploads: são salvos em `public/uploads`. Ajuste `UPLOAD_DIR` no `.env` se quiser outra pasta.

## Observações
- Envio de e-mail não está implementado; tokens de convite ficam no banco e podem ser compartilhados manualmente.
- Para trocar armazenamento de fotos, basta adaptar o handler em `app/api/memorials/[id]/photos/route.ts`.
