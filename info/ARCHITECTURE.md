# Architecture

## System overview

Vanta Commerce is a two-process application:
- **Client** (Next.js 15, port 3000): Server-rendered storefront with App Router. Pages fetch data server-side via `fetch()` to the API.
- **API** (Express 5, port 5000): REST API backed by MongoDB Atlas. Handles auth, product catalog, orders, payments, and email OTP verification.

Both run as npm workspaces in a single repo. The client calls the API over HTTP (or HTTPS in production). Authentication uses Firebase on the client and JWT verification on the API.

---

## Data models

### User (`users` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `firebaseUid` | String | required, unique, indexed |
| `name` | String | required |
| `email` | String | required, unique, lowercase, indexed |
| `avatar` | String | optional |
| `role` | String | enum `["customer", "admin"]`, default `"customer"`, indexed |
| `emailVerified` | Boolean | default `false` |
| `phone` | String | optional |
| `gender` | String | enum `["male", "female", "other"]` |
| `dateOfBirth` | Date | optional |
| `addresses` | [Address] | embedded sub-documents |
| `wishlist` | [ObjectId] | ref `Product` |
| `refreshTokenHash` | String | SHA-256 of current refresh token |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

**Address sub-schema**: `_id`, `label`, `name`, `line1`, `line2`, `city`, `state`, `postalCode`, `country`, `phone`

### Product (`products` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | required, trimmed |
| `slug` | String | required, unique, indexed |
| `description` | String | required |
| `shortDescription` | String | required |
| `price` | Number | required, min 0 |
| `discount` | Number | default 0, min 0, max 100 |
| `finalPrice` | Number | required, min 0 |
| `brand` | String | required, indexed |
| `category` | ObjectId | ref `Category`, required, indexed |
| `sku` | String | required, unique, indexed |
| `images` | [String] | at least one required |
| `tags` | [String] | indexed |
| `rating` | Number | default 0, min 0, max 5 |
| `reviewCount` | Number | default 0 |
| `colors` | [String] | |
| `sizes` | [String] | |
| `featured` | Boolean | default false, indexed |
| `bestSeller` | Boolean | default false, indexed |
| `flashSale` | Boolean | default false, indexed |
| `newArrival` | Boolean | default false, indexed |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

**Compound text index**: `{ name: "text", brand: "text", tags: "text" }`

### Category (`categories` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | required |
| `slug` | String | required, unique, indexed |
| `image` | String | optional |
| `parent` | ObjectId | ref `Category`, default null, indexed |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

Self-referencing `parent` field supports category trees.

### Order (`orders` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `orderNumber` | String | unique, indexed |
| `user` | ObjectId | ref `User`, required, indexed |
| `items` | Array | `{ product: ObjectId ref Product, name, image, price, quantity }` |
| `status` | String | enum `["pending","confirmed","packed","shipped","out_for_delivery","delivered","cancelled"]`, default `"pending"`, indexed |
| `paymentMethod` | String | enum `["stripe","razorpay","cod"]` |
| `paymentStatus` | String | enum `["pending","paid","failed"]`, default `"pending"` |
| `shippingAddress` | Mixed | |
| `billingAddress` | Mixed | |
| `subtotal` | Number | |
| `discount` | Number | |
| `shippingCost` | Number | |
| `tax` | Number | |
| `total` | Number | |
| `stripeSessionId` | String | |
| `stripePaymentIntent` | String | |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

**Compound index**: `{ user: 1, createdAt: -1 }`

### Cart (`carts` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `user` | ObjectId | ref `User`, unique sparse |
| `sessionId` | String | unique sparse |
| `items` | Array | `{ product: ObjectId ref Product, quantity, variant: Mixed, savedForLater: Boolean }` |
| `coupon` | String | |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

Supports both authenticated (user-linked) and anonymous (session-linked) carts.

### Review (`reviews` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `product` | ObjectId | ref `Product`, required, indexed |
| `user` | ObjectId | ref `User`, required, indexed |
| `rating` | Number | min 1, max 5, required |
| `body` | String | trimmed, maxlength 2000 |
| `images` | [String] | |
| `verifiedPurchase` | Boolean | default false |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

**Compound unique index**: `{ product: 1, user: 1 }` -- one review per user per product.

### Coupon (`coupons` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `code` | String | uppercase, trimmed, unique, indexed |
| `type` | String | enum `["percentage","fixed"]`, required |
| `value` | Number | min 0, required |
| `minimumOrder` | Number | default 0 |
| `expiresAt` | Date | |
| `isActive` | Boolean | default true, indexed |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

### EmailOtp (`emailotps` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `email` | String | required, unique, lowercase, indexed |
| `codeHash` | String | required (SHA-256 of 6-digit code) |
| `expiresAt` | Date | required (10 min TTL) |
| `attempts` | Number | default 0, max 5 |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

### EmailVerification (`emailverifications` collection)

| Field | Type | Constraints |
|-------|------|-------------|
| `email` | String | required, unique, lowercase, indexed |
| `verifiedAt` | Date | required |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

---

## Entity relationships

```
User ──wishlist──> Product (ObjectId[])
User ──user──> Order
User ──user──> Cart
User ──user──> Review
Product ──category──> Category
Product ──product──> Order.items[].product
Product ──product──> Cart.items[].product
Product ──product──> Review.product
Category ──parent──> Category (self-reference)
Category ──_id──> Product.category
```

---

## Authentication flow

1. Client signs in with Firebase Authentication (Google popup or email/password).
2. Client obtains a Firebase ID token.
3. Client POSTs the ID token to `POST /api/v1/auth/exchange`.
4. API verifies the token with Firebase Admin SDK.
5. API checks email verification status (Firebase `email_verified` flag or `EmailVerification` collection). Returns `403 { code: "EMAIL_NOT_VERIFIED" }` if not verified.
6. API upserts the User record in MongoDB (by `firebaseUid`).
7. API signs a JWT access token (15 min expiry) and a refresh token (30 day expiry).
8. API stores the SHA-256 hash of the refresh token on the User record.
9. API sets the refresh token as an HTTP-only, secure, same-site=strict cookie on path `/api/v1/auth`.
10. API returns the access token and user profile to the client.
11. Client stores the access token in localStorage (`vanta.access-token`).
12. Axios interceptor attaches `Authorization: Bearer <token>` to every API request.
13. On 401, Axios interceptor attempts `POST /api/v1/auth/refresh` (uses cookie), retries the original request with the new access token.
14. Logout clears the refresh cookie via `POST /api/v1/auth/logout`.

### Email OTP verification

- `POST /api/v1/auth/send-otp` with `{ email }` -- generates 6-digit code, hashes it, stores in `emailotps` with 10 min TTL, sends via SMTP (or logs to console if no SMTP configured). Rate-limited to 1 per minute.
- `POST /api/v1/auth/verify-otp` with `{ email, code }` -- verifies hash, max 5 attempts. On success, creates record in `emailverifications` and deletes the OTP record.
- Google sign-ins are exempt (Google accounts have verified emails by default).

---

## Security middleware stack (applied in order)

1. `helmet()` -- security headers
2. `cors({ origin, credentials: true })` -- CORS
3. `rateLimit({ windowMs: 15min, limit: 300 })` -- rate limiting
4. `express.raw()` on webhook path -- raw body for Stripe signature verification
5. `express.json({ limit: "1mb" })` -- JSON body parser
6. `cookieParser()` -- cookie parsing
7. Custom `mongoSanitize()` on `req.body` and `req.query` -- prevents NoSQL injection
8. Route handlers
9. `errorHandler` -- centralized error responses (ZodError -> 422, others -> statusCode || 500)

---

## Index summary

| Model | Index | Type |
|-------|-------|------|
| User | `firebaseUid` | unique |
| User | `email` | unique |
| User | `role` | standard |
| Product | `slug` | unique |
| Product | `sku` | unique |
| Product | `brand` | standard |
| Product | `category` | standard |
| Product | `tags` | standard |
| Product | `featured`, `bestSeller`, `flashSale`, `newArrival` | standard |
| Product | `{ name, brand, tags }` text | compound text |
| Order | `orderNumber` | unique |
| Order | `user` | standard |
| Order | `status` | standard |
| Order | `{ user, createdAt }` | compound |
| Category | `slug` | unique |
| Category | `parent` | standard |
| Cart | `user` | unique sparse |
| Cart | `sessionId` | unique sparse |
| Coupon | `code` | unique |
| Coupon | `isActive` | standard |
| Review | `{ product, user }` | compound unique |
| EmailOtp | `email` | unique |
| EmailVerification | `email` | unique |

---

## Catalog seeder

The seed script (`npm run seed -w ecommerce-api`) is idempotent via `$setOnInsert` -- it creates products/categories if they don't exist but never updates existing ones. To modify seed data, wipe the DB before reseeding.

**Seed data**: 144 products across 27 categories with rotating discounts (0%, 10%, 15%, 20%), synthetic ratings (4.2--4.9), and boolean flags (featured every 5th, bestSeller every 6th, flashSale every 7th, newArrival every 4th). Images are Unsplash URLs mapped by category.

---

## Deployment targets

| Component | Target |
|-----------|--------|
| Client | Vercel |
| API | Render or Railway |
| Database | MongoDB Atlas |
| Auth | Firebase Authentication |
| Payments | Stripe |

Set `NEXT_PUBLIC_API_URL` and `CLIENT_ORIGIN` to production HTTPS URLs. Use separate JWT secrets per environment.
