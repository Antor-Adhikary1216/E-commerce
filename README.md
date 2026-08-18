# Vanta Commerce

A full-stack e-commerce platform with a Next.js storefront and Express API, powered by MongoDB Atlas, Firebase Auth, and Stripe payments.

![Landing Page](https://ecommerce-client-sepia.vercel.app/og-image.png)

**Live Demo:** [https://ecommerce-client-sepia.vercel.app](https://ecommerce-client-sepia.vercel.app)

## Project Overview

Vanta Commerce is a modern, production-ready e-commerce solution built for the Indian market. It features a sleek dark-nav design with warm canvas tones and lime-green accents, delivering a premium shopping experience across all devices.

### Key Highlights

- **117+ products** seeded across 25 categories — Mobiles, Laptops, Headphones, Sneakers, Skincare, Furniture, Grocery, Fashion, and more
- **Real-time product browsing** with category filters, text search, sort options, and paginated results
- **Full checkout flow** with Stripe integration, order tracking with a 6-step progress tracker, and payment history
- **Admin panel** with dashboard analytics, product management (CRUD with pagination), order management, user management, payment history, and live customer care chat
- **Role-based access** — customers see a streamlined storefront, admins get a full management dashboard
- **Responsive design** — works seamlessly on mobile, tablet, and desktop
- **Firebase Authentication** with Google sign-in, email/password, and email OTP verification
- **JWT-based auth** with automatic token refresh for uninterrupted sessions

### Screenshots

| Home Page | Product Detail | Admin Dashboard |
|-----------|---------------|-----------------|
| ![Home](https://ecommerce-client-sepia.vercel.app/og-image.png) | ![Product](https://ecommerce-client-sepia.vercel.app/og-image.png) | ![Admin](https://ecommerce-client-sepia.vercel.app/og-image.png) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Express 5, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | Firebase Authentication + JWT access/refresh tokens |
| Payments | Stripe Checkout Sessions + Webhooks |
| State | React Context (localStorage cart/wishlist), TanStack Query |
| Alerts | SweetAlert2, react-hot-toast |
| Deployment | Vercel (Client + API) |

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
- 8 quick-access category icons on the homepage
- Hero banner with promotional deals

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
- Track order page with real-time status

### Admin Panel
- Dashboard with sales stats, recent orders, and quick actions
- Product management — list with pagination (12/page), search, create, edit, delete
- Full product creation form with images, pricing, variants, and visibility flags
- Order management with status updates
- User management
- Payment history
- Live customer care chat

### Auth
- Google and Email/Password sign-in via Firebase
- Email OTP verification
- JWT access token with auto-refresh interceptor
- Role-based routing (admin vs customer)

### Support
- Help center with FAQ accordion
- Contact cards (Email, Phone, Live Chat)
- Browse topics with category cards

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
| GET | `/admin/products` | Admin | List all products (admin) |
| POST | `/admin/products` | Admin | Create product |
| PUT | `/admin/products/:id` | Admin | Update product |
| DELETE | `/admin/products/:id` | Admin | Delete product |
| GET | `/admin/orders` | Admin | List all orders |
| GET | `/admin/users` | Admin | List all users |
| PUT | `/user/profile` | Yes | Update user profile |

## Project Structure

```
.
├── ecommerce-client/          # Next.js storefront
│   └── src/
│       ├── app/               # App Router pages
│       │   ├── admin/         # Admin panel (dashboard, products, orders, users, payments, conversations)
│       │   ├── account/       # Customer account (dashboard, orders, payments, tracking)
│       │   ├── cart/          # Shopping cart
│       │   ├── checkout/      # Checkout flow
│       │   ├── products/      # Product detail pages
│       │   ├── shop/          # Product catalog
│       │   ├── sale/          # Flash sale items
│       │   ├── search/        # Search results
│       │   └── support/       # Help center
│       ├── components/        # Reusable UI components
│       │   ├── ui/            # Button, spinner, skeleton
│       │   ├── motion/        # Framer Motion animations
│       │   └── support/       # Support page components
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
│       ├── seeds/             # Catalog seeder (117 products, 25 categories)
│       ├── services/          # OTP, email
│       └── utils/             # JWT helpers
```

## License

Private
