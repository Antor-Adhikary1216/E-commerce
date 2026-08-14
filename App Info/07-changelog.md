# Changelog

## 2026-08-08

### Added
- **`/checkout` route** — New shipping details form page with fields for name, email, phone, and full address
- **Auto-populate contact info** — Name and email pre-fill from Firebase auth; phone from user profile API
- **Shipping address persistence** — Address data saved to order document in MongoDB
- **Order summary sidebar** — Checkout page shows selected items with images, quantities, and pricing

### Changed
- **`/place-order` page** — "Proceed to Payment" button now navigates to `/checkout` instead of calling Stripe API directly
- **Payment controller** — `createCheckout` accepts and stores `shippingAddress` in the order

### Updated Flow
```
/cart → /place-order → /checkout (shipping form) → [Stripe] → /checkout/success
```

### Files Touched
| File | Status |
|---|---|
| `ecommerce-client/src/app/checkout/page.tsx` | Created |
| `ecommerce-client/src/app/place-order/page.tsx` | Modified |
| `ecommerce-api/src/controllers/payment.controller.ts` | Modified |
| `ecommerce-client/src/app/cart/page.tsx` | Modified |
| `ecommerce-client/src/components/cart-item-card.tsx` | Created |
| `ecommerce-client/src/components/price-details.tsx` | Created |
| `ecommerce-client/src/components/select-item-card.tsx` | Created |

---

## 2026-08-14

### Added
- **Razorpay env vars** — `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` added to env schema (optional, for future use)
- **Login auto-redirect** — If user is already authenticated, login page redirects to account (or `?redirect=` target)
- **Google auth email verification** — Google sign-in now handles `EMAIL_NOT_VERIFIED` error by triggering OTP flow
- **Improved error handling** — Login page uses new `formatError()` helper with better network/server error messages
- **Product image fallback** — Product page shows placeholder image when product has no images
- **Checkout button animations** — Submit buttons upgraded with Framer Motion spring animations, blue gradient styling, and shopping cart icon
- **Email in shipping payload** — Checkout form now sends `email` field in `shippingAddress` to backend

### Changed
- **Webhook endpoint renamed** — `/payments/webhook` → `/payments/webhook/stripe` (more explicit naming)
- **Payment controller refactored** — `createCheckout` renamed to `createStripeCheckout`; legacy `createCheckout`/`handleWebhook` aliases kept for backward compatibility
- **Payment routes reformatted** — Minified single-line file expanded to readable multi-line format
- **Order model reformatted** — Minified single-line file expanded to readable multi-line format
- **Order model `paymentMethod`** — Removed `"razorpay"` from enum, now `["stripe", "cod"]` only
- **Shipping detail model** — `order` field changed from `required: true` to optional (allows creating shipping detail before order exists)
- **Checkout success page** — Supports `?order_number=` query param; clears cart only after successful order fetch
- **Search dropdown fix** — Header search dropdown no longer always shows when input is empty (was a bug)
- **API client refresh URL** — Fixed refresh token endpoint to include `/api/v1/` prefix

### Fixed
- **React hooks dependencies** — Added `requireAuth` to `useEffect` dependency arrays across cart, checkout, login, place-order, wishlist, and orders pages (eliminates stale closure warnings)
- **Cart "Save for later" toast** — Fixed toast message logic (was showing inverted message due to state update timing)
- **User controller TypeScript** — Added `as string` cast for `address.id()` calls

### Files Touched
| File | Status |
|---|---|
| `ecommerce-api/src/app.ts` | Modified |
| `ecommerce-api/src/config/env.ts` | Modified |
| `ecommerce-api/src/controllers/payment.controller.ts` | Modified |
| `ecommerce-api/src/controllers/user.controller.ts` | Modified |
| `ecommerce-api/src/models/order.model.ts` | Modified |
| `ecommerce-api/src/models/shipping-detail.model.ts` | Modified |
| `ecommerce-api/src/routes/payment.routes.ts` | Modified |
| `ecommerce-client/src/app/account/orders/[id]/page.tsx` | Modified |
| `ecommerce-client/src/app/account/orders/page.tsx` | Modified |
| `ecommerce-client/src/app/cart/page.tsx` | Modified |
| `ecommerce-client/src/app/checkout/page.tsx` | Modified |
| `ecommerce-client/src/app/checkout/success/page.tsx` | Modified |
| `ecommerce-client/src/app/login/page.tsx` | Modified |
| `ecommerce-client/src/app/place-order/page.tsx` | Modified |
| `ecommerce-client/src/app/products/[slug]/page.tsx` | Modified |
| `ecommerce-client/src/app/wishlist/page.tsx` | Modified |
| `ecommerce-client/src/components/site-header.tsx` | Modified |
| `ecommerce-client/src/services/api-client.ts` | Modified |
| `ecommerce-client/eslint.config.mjs` | Created |
