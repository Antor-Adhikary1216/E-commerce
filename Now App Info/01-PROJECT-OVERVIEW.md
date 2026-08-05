# Shopping India — Project Overview

## What is this?
Shopping India is a full-stack e-commerce platform with:
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend**: Express 5 (TypeScript), Mongoose, MongoDB Atlas
- **Auth**: Firebase Authentication (client SDK) → JWT access + refresh tokens
- **Payments**: Stripe integration

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Client | Next.js 15, React 19, Tailwind CSS, Framer Motion, Zustand |
| API | Express 5, TypeScript, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | Firebase Auth + JWT (access 15min, refresh 30day HTTP-only cookie) |
| Payments | Stripe |
| Icons | Lucide React |
| Validation | Zod |

## Project Structure
```
D:\E-commarces bussines\
├── ecommerce-client/          # Next.js 15 frontend
│   └── src/
│       ├── app/               # App Router pages
│       │   ├── page.tsx       # Homepage
│       │   ├── shop/          # Shop/catalog page
│       │   ├── search/        # Search results page
│       │   ├── products/      # Product detail pages
│       │   ├── cart/          # Shopping cart
│       │   ├── wishlist/      # Saved items
│       │   ├── login/         # Auth (login/signup)
│       │   ├── account/       # Profile, addresses, orders
│       │   └── checkout/      # Checkout flow
│       ├── components/        # Reusable UI components
│       │   ├── site-header.tsx    # Navbar with search
│       │   ├── site-footer.tsx    # Footer
│       │   ├── logo.tsx           # Shopping India SVG logo
│       │   ├── product-card.tsx   # Product card with Add to Cart/Buy Now
│       │   ├── catalog.tsx        # Product grid with filters
│       │   └── empty-state.tsx    # Empty state component
│       ├── lib/               # Utilities and hooks
│       │   ├── use-search-history.ts  # Search history (localStorage)
│       │   ├── use-auth-user.ts       # Firebase auth state
│       │   ├── use-require-auth.ts    # Auth guard hook
│       │   ├── token.ts               # JWT token management
│       │   ├── firebase.ts            # Firebase config
│       │   └── catalog.ts             # API fetch helpers
│       ├── store/             # State management
│       │   ├── cart.tsx        # Cart context + localStorage
│       │   └── wishlist.tsx    # Wishlist context + localStorage
│       └── services/
│           └── api-client.ts   # Axios with token refresh interceptor
│
├── ecommerce-api/             # Express 5 backend
│   └── src/
│       ├── app.ts             # Express app setup
│       ├── server.ts          # Server entry
│       ├── config/
│       │   └── env.ts         # Environment variables
│       ├── models/            # Mongoose schemas
│       │   ├── user.model.ts      # User (with addresses, avatar)
│       │   ├── product.model.ts   # Product (with text search index)
│       │   └── category.model.ts  # Category
│       ├── routes/            # API routes
│       │   ├── auth.routes.ts     # Login/signup/refresh/logout
│       │   ├── product.routes.ts  # Product CRUD + search
│       │   ├── category.routes.ts # Categories
│       │   ├── user.routes.ts     # Profile + addresses
│       │   ├── order.routes.ts    # Orders
│       │   └── payment.routes.ts  # Stripe payments
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Auth, error handling
│       └── utils/             # Token helpers
│
└── info/                      # Old documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── CLIENT.md
```
