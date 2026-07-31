# Vanta Commerce

Vanta Commerce is a full-stack, customer-facing e-commerce foundation. It provides a responsive Next.js marketplace storefront and a TypeScript/Express API designed for MongoDB Atlas. The project deliberately excludes an admin panel, while its domain models, role field, and route structure leave room to add one without restructuring the customer application.

## Current implementation

The application currently includes:

- A responsive marketplace home page with category discovery, promotional hero, deal rows, product cards, responsive navigation, and footer.
- A custom visual system: dark-ink navigation, warm neutral canvas, lime-green actions, rounded product cards, and keyboard-visible focus indicators.
- Theme, toast, and TanStack Query provider infrastructure.
- A Firebase client bootstrap and an Axios API client with access-token refresh handling.
- Firebase ID-token exchange on the API, short-lived JWT access tokens, and HTTP-only refresh-cookie support.
- MongoDB models for users, products, categories, carts, orders, reviews, and coupons.
- Public product list/detail endpoints with search, pagination, filtering, and common storefront sorting.
- A duplicate-safe catalog seeder with 43 sample products across electronics, fashion, shoes, beauty, furniture, books, groceries, sports, toys, watches, accessories, and home categories.
- Production baseline middleware: Helmet, CORS, rate limits, request-size limit, Mongo operator sanitization, DTO validation, and centralized error responses.

Some customer workflows are scaffolded at the data/API-foundation level but are not yet surfaced as finished pages or endpoints: checkout payments, profile management, wishlist/cart UI, review submission, invoices, order tracking, and Cloudinary uploads. These should be implemented before a production launch.

## Technology

| Layer | Technology |
| --- | --- |
| Web application | Next.js 15, React 19, TypeScript, App Router |
| Styling | Tailwind CSS, class-variance-authority, Lucide icons |
| Client state | TanStack Query, React Hook Form, Zod, Axios |
| UI utilities | next-themes, React Hot Toast, Framer Motion |
| API | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas with Mongoose |
| Identity | Firebase Authentication, JWT access/refresh token exchange |
| Media | Cloudinary-ready configuration |
| Deployment targets | Vercel (client), Render/Railway (API), MongoDB Atlas |

## Repository layout

```
.
├── ecommerce-client/                 # Next.js customer storefront
│   ├── src/
│   │   ├── app/                      # App Router pages, layout and global styles
│   │   ├── components/               # Reusable UI and storefront components
│   │   ├── constants/                # Demo catalog data
│   │   ├── features/                 # Reserved feature modules
│   │   ├── hooks/                    # Reserved reusable hooks
│   │   ├── lib/                      # Firebase bootstrap and shared helpers
│   │   ├── providers/                # Query, theme and toast providers
│   │   ├── services/                 # Axios API client
│   │   ├── store/                    # Reserved client state stores
│   │   ├── styles/                   # Reserved non-global styles
│   │   ├── types/                    # Reserved shared TypeScript types
│   │   └── utils/                    # Reserved presentation utilities
│   ├── .env.example
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── ecommerce-api/                    # Express API
│   ├── src/
│   │   ├── config/                   # Environment validation and Mongo connection
│   │   ├── controllers/              # Product and authentication handlers
│   │   ├── middleware/               # Authentication and error middleware
│   │   ├── models/                   # Mongoose domain models
│   │   ├── routes/                   # Versioned HTTP route modules
│   │   ├── seeds/                    # Idempotent demo catalog seed
│   │   ├── services/                 # Reserved domain services
│   │   ├── utils/                    # JWT helpers
│   │   └── validators/               # Reserved DTO validators
│   ├── .env.example
│   └── package.json
├── package.json                       # npm workspace scripts
└── package-lock.json
```

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- MongoDB Atlas database
- Firebase project with Email/Password and Google providers configured
- Firebase Admin service account for the API
- Optional: Cloudinary, Stripe, and Razorpay credentials when those modules are implemented

## Setup

1. Install workspace dependencies:

   ```bash
   npm install
   ```

2. Create `ecommerce-client/.env.local` from `ecommerce-client/.env.example`.

3. Create `ecommerce-api/.env` from `ecommerce-api/.env.example`.

4. Add the required MongoDB, Firebase, JWT, and client-origin values. Do not commit either environment file.

5. Seed the initial product catalog:

   ```bash
   npm run seed -w ecommerce-api
   ```

6. Run both applications:

   ```bash
   npm run dev
   ```

The storefront is served at `http://localhost:3000`. The API is served at `http://localhost:5000`.

## Environment variables

### Client: `ecommerce-client/.env.local`

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Versioned API base URL, for example `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web application API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app ID |

### API: `ecommerce-api/.env`

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | API listening port |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLIENT_ORIGIN` | Allowed storefront origin |
| `JWT_ACCESS_SECRET` | At least 32-character access-token signing secret |
| `JWT_REFRESH_SECRET` | At least 32-character refresh-token signing secret |
| `FIREBASE_PROJECT_ID` | Firebase Admin project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service-account email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name, reserved for upload flows |
| `CLOUDINARY_API_KEY` | Cloudinary API key, reserved for upload flows |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret, reserved for upload flows |

## API surface

All API routes are prefixed with `/api/v1`.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Service health response |
| `POST` | `/auth/exchange` | Verifies a Firebase ID token and issues app tokens |
| `POST` | `/auth/refresh` | Issues a new access token from a valid refresh cookie |
| `POST` | `/auth/logout` | Clears the refresh cookie |
| `GET` | `/products` | Lists products; supports `page`, `limit`, `q`, `category`, `brand`, `feature`, and `sort` |
| `GET` | `/products/:slug` | Returns a product and its populated category |

Supported product sort values are `latest`, `price_asc`, `price_desc`, and `rating`.

## Authentication flow

1. The browser signs in with Firebase Authentication.
2. The browser sends the Firebase ID token to `POST /api/v1/auth/exchange`.
3. The API verifies it with Firebase Admin, creates or updates the user record, and returns a 15-minute access token.
4. The API stores a 30-day refresh token in a secure, HTTP-only cookie and retains only its SHA-256 hash in MongoDB.
5. Axios retries one unauthorized request through `/auth/refresh`.
6. Logout clears the refresh cookie. A production logout flow should also clear the saved refresh-token hash.

Passwords are never stored in MongoDB.

## Data model notes

- `Product`: unique `slug` and `sku`, search index on name/brand/tags, category and merchandising flag indexes.
- `Category`: supports parent/child trees via the optional `parent` reference.
- `User`: Firebase UID and email are unique; customer/admin role is indexed for future authorization.
- `Cart`: supports both authenticated user carts and anonymous session carts.
- `Order`: stores price snapshots, status, payment state, and addresses; user/date and order-number indexes are included.
- `Review`: one review per user/product pair and a verified-purchase indicator.
- `Coupon`: unique uppercase code with active-state and expiration data.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts client and API together |
| `npm run build` | Builds both workspaces |
| `npm run lint` | Runs both workspace linters |
| `npm run dev -w ecommerce-client` | Starts only the Next.js storefront |
| `npm run dev -w ecommerce-api` | Starts only the Express API |
| `npm run seed -w ecommerce-api` | Runs the idempotent catalog seeder |

## Security and production checklist

- Keep `.env`, `.env.local`, and all credentials out of source control.
- Use separate, long random JWT access and refresh secrets in every deployment environment.
- Configure Firebase Authorized Domains and OAuth redirect URIs for the deployed domain.
- Set `CLIENT_ORIGIN` to the exact production frontend URL.
- Use HTTPS in production so secure refresh cookies work as intended.
- Configure Cloudinary upload presets and server-side upload validation before enabling avatar or review-image uploads.
- Add payment-provider webhook signature validation before accepting Stripe or Razorpay payments.
- Add integration tests, API tests, and CI checks before deployment.

## Deployment

- Deploy `ecommerce-client` to Vercel and set its public environment variables there.
- Deploy `ecommerce-api` to Render or Railway; set all server secrets in the provider’s secret manager.
- Use MongoDB Atlas IP/network access rules appropriate for the API deployment environment.
- Change `NEXT_PUBLIC_API_URL` and `CLIENT_ORIGIN` to production HTTPS URLs.

## Working conventions

- Preserve the workspace structure and use feature/domain modules instead of expanding page files indefinitely.
- Validate all API input with Zod before it reaches controllers or models.
- Keep pages server-rendered by default; add client components only for interactive behavior.
- Build future admin functionality in a separate route group/application with role middleware, rather than mixing it into customer routes.
- Run relevant build and lint commands before opening a pull request.
