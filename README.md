# Vanta Commerce

A full-stack e-commerce platform with a Next.js storefront and Express API, powered by MongoDB Atlas, Firebase Auth, and Stripe payments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Express 5, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | Firebase Authentication + JWT access/refresh tokens |
| Payments | Stripe Checkout Sessions + Webhooks |
| State | React Context (localStorage cart/wishlist), TanStack Query |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas connection string
- Firebase project (Auth)
- Stripe account (optional, for payments)

### Environment Variables

**API** (`ecommerce-api/.env`):

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
STRIPE_SECRET_KEY=sk_test_...          # optional
STRIPE_WEBHOOK_SECRET=whsec_...       # optional
```

**Client** (`ecommerce-client/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Install & Run

```bash
# Install dependencies
npm install

# Seed the database (optional)
npm run seed -w ecommerce-api

# Start both client and API
npm run dev
```

- Client: http://localhost:3000
- API: http://localhost:5000

## Features

### Storefront
- Product browsing with category filters, search, sort, and pagination
- Product detail pages with images, ratings, and pricing
- Flash sale and new arrival sections
- Responsive design with dark-nav, warm canvas, and lime-green accents

### Cart & Checkout
- Add/remove items with confirmation dialogs
- Quantity editing with +/- controls
- Clear cart functionality
- Order summary with live total
- Stripe Checkout redirect with cancel handling

### Orders
- Order history page (`/account/orders`)
- Order detail with 6-step progress tracker (`/account/orders/[id]`)
- Order number displayed on checkout success

### Auth
- Google and Email/Password sign-in via Firebase
- Email OTP verification
- JWT access token with auto-refresh interceptor

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/auth/exchange` | No | Exchange Firebase token for JWT |
| POST | `/auth/refresh` | No | Refresh access token |
| POST | `/auth/logout` | No | Logout |
| POST | `/auth/send-otp` | No | Send email OTP |
| POST | `/auth/verify-otp` | No | Verify email OTP |
| GET | `/products` | No | List products (search, filter, sort, paginate) |
| GET | `/products/:slug` | No | Get product by slug |
| GET | `/categories` | No | List categories with product counts |
| POST | `/payments/create-checkout` | Yes | Create Stripe checkout session |
| POST | `/payments/webhook` | No | Stripe webhook handler |
| GET | `/orders` | Yes | List user orders |
| GET | `/orders/:id` | Yes | Get order detail |
| GET | `/orders/session/:sessionId` | Yes | Get order by Stripe session |

## Project Structure

```
.
├── ecommerce-client/          # Next.js storefront
│   └── src/
│       ├── app/               # App Router pages
│       ├── components/        # Reusable UI components
│       ├── lib/               # Firebase, auth hooks, helpers
│       ├── providers/         # Context providers
│       ├── services/          # Axios API client
│       └── store/             # Cart & wishlist state
│
├── ecommerce-api/             # Express API
│   └── src/
│       ├── config/            # Env, DB, Firebase, Stripe
│       ├── controllers/       # Route handlers
│       ├── middleware/         # Auth, error handling
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Express routers
│       ├── seeds/             # Catalog seeder (143 products)
│       ├── services/          # OTP, email
│       └── utils/             # JWT helpers
```

## License

Private
