# FutMax

FutMax é um web app mobile-first para homens 50+ que fazem apostas esportivas. O sistema oferece análises comparativas entre clubes, compra de créditos via PIX sandbox, histórico completo e exportação em PDF.

## Rotas principais

### Pública
- `/` landing page com SEO e FAQ

### Auth
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password?token=...`

### Logado
- `/dashboard`
- `/credits`
- `/analysis`
- `/analysis/[id]`
- `/settings`

## Setup local (sem Docker)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

## Setup local com Docker

```bash
docker build -t futmax .
docker run --env-file .env -p 3000:3000 futmax
```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

## PIX sandbox

1. Acesse `/credits` logado.
2. Escolha um pacote e clique em **Gerar PIX**.
3. Use **Confirmar pagamento (sandbox)** para liberar créditos.

## OpenAI

- Defina `OPENAI_API_KEY` no `.env`.
- O consumo ocorre apenas no servidor (route handler).

## Deploy na Vercel

1. Crie o projeto na Vercel apontando para este repositório.
2. Configure as variáveis:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `OPENAI_API_KEY`
   - `ENABLE_STATIC_ADMIN`
   - `ANALYSIS_COST_CREDITS`
3. Rode `npx prisma migrate deploy` no pós-build (ou manualmente) se necessário.

## Checklist de produção

- Integrar provedor PIX real e webhooks confiáveis.
- Ajustar rate limit e antifraude.
- Monitorar logs, erros e métricas.
- Adicionar observabilidade (APM + alertas).
- Revisar políticas de privacidade e LGPD.

## Rodar localmente

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```
