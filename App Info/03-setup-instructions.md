# Setup Instructions

## Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Stripe account (with API keys)
- Firebase project (for authentication)
- Vercel account (for deployment)

## Environment Variables

### Backend (`ecommerce-api/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
CLIENT_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

### Frontend (`ecommerce-client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Running Locally

```bash
# Backend
cd ecommerce-api
npm install
npm run dev

# Frontend (separate terminal)
cd ecommerce-client
npm install
npm run dev
```

The app runs at `http://localhost:3000`.
