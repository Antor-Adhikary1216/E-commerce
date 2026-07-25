# Vanta Commerce

Customer-facing e-commerce platform foundation built as a workspace monorepo.

## Run locally

1. Copy `ecommerce-client/.env.example` and `ecommerce-api/.env.example` to `.env.local` / `.env` and provide credentials.
2. Run `npm install` at the repository root.
3. Seed the catalog with `npm run seed -w ecommerce-api`.
4. Run `npm run dev`.

The client runs on port 3000 and the API runs on port 5000. The API is intentionally role-aware, but exposes customer routes only; future administrative routes can be mounted independently behind role middleware.
