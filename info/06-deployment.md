# Deployment Guide — Vercel

## Frontend Deployment

### Prerequisites
- Vercel account linked to GitHub
- Repository: `Antor-Adhikary1216/E-commerce`

### Steps

1. **Import project** on Vercel dashboard
   - Root directory: `ecommerce-client`
   - Framework: Next.js (auto-detected)

2. **Environment Variables** (add in Vercel dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app/api/v1
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Deploy** — Vercel auto-deploys on push to `main`

### Backend Deployment

The Express API can be deployed separately (e.g., Railway, Render, or a VPS). Ensure:
- `CLIENT_ORIGIN` env var points to the Vercel frontend URL
- Stripe webhook endpoint is configured in Stripe dashboard
- MongoDB Atlas IP whitelist includes the deployment server

### Post-Deployment Checklist

- [ ] Test login/signup flow
- [ ] Test add to cart → place order → checkout → payment
- [ ] Verify Stripe webhook processes orders
- [ ] Check order history displays correctly
