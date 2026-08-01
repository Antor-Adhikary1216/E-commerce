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

## Google sign-in setup

Both sides need a Firebase project. The client uses the Firebase Web SDK (Google popup sign-in on `/login`), and the API uses the Firebase Admin SDK to verify the returned ID token on `POST /api/v1/auth/exchange`.

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) and register a web app.
2. Copy the web app's config values into `ecommerce-client/.env.local` (`NEXT_PUBLIC_FIREBASE_API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`).
3. In Firebase console → Authentication → Sign-in method, enable **Google**.
4. `localhost` is authorized by default, so popup sign-in works in local dev. For a deployed client, add its domain to Authentication → Settings → Authorized domains.
5. Create a service account under Project settings → Service accounts → Generate new private key (JSON).
6. Put the `project_id`, `client_email`, and `private_key` values into `ecommerce-api/.env` as `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (keep the key's `\n` escapes; the API normalizes them). The API initializes the Admin SDK from these at startup (`ecommerce-api/src/config/firebase.ts`).
7. Restart both dev servers and open `http://localhost:3000/login`.

## Email verification (6-digit code)

Accounts created with email/password can't sign in until the email is verified. The API (`POST /api/v1/auth/exchange`) returns `403 { code: "EMAIL_NOT_VERIFIED" }` for unverified emails; the client then walks the user through a 6-digit code sent to their inbox:

- `POST /api/v1/auth/send-otp` `{ email }` — generates a 6-digit code (10 min TTL, hashed in MongoDB), emails it. Rate-limited to one per minute per address.
- `POST /api/v1/auth/verify-otp` `{ email, code }` — checks the code (5 attempt limit) and permanently marks the email verified in the `EmailVerification` collection.
- Once verified, the exchange succeeds and also syncs `emailVerified: true` on the Firebase user.

Google sign-ins are exempt (Google accounts have verified emails). Code lives in `ecommerce-api/src/services/otp.service.ts`.

Email delivery uses SMTP via nodemailer (`ecommerce-api/src/config/email.ts`). Set these in `ecommerce-api/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Vanta <you@gmail.com>
```

With no SMTP config, codes are logged to the API console (dev fallback) so the flow is testable without credentials.

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

## Development log

### Session 2026-07-31 — storefront fix-up, catalog browsing, cart & wishlist

All work below is committed to `main`. Client runs at `http://localhost:3000`, API at `http://localhost:5000` (both started by `npm run dev`).

**Fixed 404s and added missing pages**
- Header link targets no longer 404: added `/login`, `/cart`, `/wishlist`, `/account`.
- Category browsing no longer 404s: added `/shop` (category pills, sort, pagination), `/products/[slug]` (detail page), `/sale` (flash-sale grid). All are server-rendered and driven by the API.
- Homepage product cards no longer 404: the homepage now fetches the top-rated products from the API instead of static `demo-products.ts`, whose slugs (`premium-cotton-tee`, `nike-air-max-90`, `minimal-desk-lamp`) did not exist in the database. The file was deleted.
- Header + homepage category links now point to real seeded categories. The old names ("Electronics", "Fashion", "Home & Furniture", "Appliances", "Books & More", "Travel") matched no seeded category and returned empty catalogs.

**API**
- New `GET /api/v1/categories` (`ecommerce-api/src/controllers/category.controller.ts`, `ecommerce-api/src/routes/category.routes.ts`) returns categories with product counts via an aggregate `$lookup`.

**Client architecture**
- `ecommerce-client/src/lib/catalog.ts` — server-side fetch helpers (`fetchCatalog`, `fetchCategories`, `fetchProduct`), API response types, and a shared `toCard()` mapper (full `CatalogProduct` → `ProductCardData`).
- `ecommerce-client/src/components/catalog.tsx` — reusable catalog grid (category pills, sort links, pagination, empty state) used by both `/shop` and `/sale`.
- `ecommerce-client/src/components/site-footer.tsx` + `newsletter-form.tsx` — redesigned footer, moved into the root layout so it appears on every page. The newsletter form is presentational (toast confirmation only).
- `ecommerce-client/src/lib/swal.ts` — SweetAlert2 helpers (`addedToCart`, `savedForLater`) with brand styling (`#16815d` button, rounded popup, auto-close timer).

**Cart & wishlist (functional, localStorage-backed)**
- `ecommerce-client/src/store/cart.tsx` and `wishlist.tsx` — React context providers persisted under `vanta.cart` / `vanta.saved`; mounted inside `AppProviders`.
- Header Cart pill and Saved link show live count badges.
- `/cart` — line items with images, quantity steppers, remove, and a live subtotal/total summary; the checkout button is a "coming soon" SweetAlert placeholder.
- `/wishlist` — grid of saved product cards; hearts toggle on/off everywhere (cards + product page) and persist.
- Product page "Add to cart" adds to the store, then the button switches to a lime "In cart — view cart" link to `/cart`.
- `ProductCard` and `ProductActions` are now client components wired to the stores.

**Auth groundwork**
- `ecommerce-client/src/lib/firebase.ts` now guards/lazily initializes Firebase so pages do not crash during SSR prerender while keys are blank.

**Environment / infra**
- `ecommerce-client/.env.local` created (gitignored): `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`; Firebase keys intentionally left blank.
- `.gitignore` extended with `*.tsbuildinfo`.
- All changes committed (`396677f`) and pushed to `origin/main`.

### Operational notes (important!)

- **Never run `next build` while `next dev` is running.** The build overwrites the dev server's `.next` directory and every route then starts returning 500 (Turbopack manifest write conflicts). Instead, typecheck with `npx tsc --noEmit` in `ecommerce-client` during development, and restart the dev server after any full build.
- The client dev server was restarted detached via `Start-Process cmd "/c npm run dev -w ecommerce-client > <log> 2>&1"`; logs are at `C:\Users\anika\AppData\Local\Temp\opencode\next-dev.log`.
- `npm run lint` is currently broken repo-wide: ESLint 9 requires a flat `eslint.config.js` and the repo ships none. Pre-existing, not caused by this session's work.
- `ecommerce-api/.env` (gitignored) exists with Mongo/secret values; `ecommerce-client/.env.local` is gitignored. Neither is ever committed.
- The catalog seeder uses `$setOnInsert`, so changing seed data requires a DB wipe before reseeding (existing products are never updated).

### Known gaps / next steps

- Firebase keys are blank, so email/Google sign-in and the `/account` session will not work until `NEXT_PUBLIC_FIREBASE_*` are set in `ecommerce-client/.env.local`.
- The header search input is not wired to anything; hook it to `/shop?q=`.
- Footer links (`/about`, `/shipping`, `/payments`, `/returns`, `/privacy`) still 404 — create the pages or point them elsewhere.
- Checkout/payments, review submission, order tracking, profile management, and Cloudinary uploads are not implemented (payment webhook signature validation still required).
- Product detail shows a single image; no gallery, specs, or reviews yet.
- No integration/API tests or CI pipeline.
- `GET /api/v1/products?q=` uses MongoDB text search, which requires the text index (present on name/brand/tags).

