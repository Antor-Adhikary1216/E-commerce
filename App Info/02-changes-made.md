# Changes Made — Latest Session (2026-08-14)

## Summary

Major payment controller refactor, webhook endpoint rename, checkout UI polish, login improvements, and bug fixes across the frontend.

## Backend Changes

### 1. `ecommerce-api/src/controllers/payment.controller.ts` (REFACTORED)

- **`createCheckout` → `createStripeCheckout`** — Main checkout function renamed for clarity
- **Extracted helper functions** — `resolveItems()`, `buildOrderItems()`, `createShippingDetail()` split out for readability
- **`handleWebhook` → `handleStripeWebhook`** — Webhook handler renamed
- **Legacy aliases preserved** — `createCheckout` and `handleWebhook` re-exported as wrappers for backward compatibility
- **Error handling** — Stripe checkout wrapped in try/catch; returns 400 with message on failure

### 2. `ecommerce-api/src/app.ts` (MODIFIED)

- Webhook route changed: `/api/v1/payments/webhook` → `/api/v1/payments/webhook/stripe`
- Import updated: `handleWebhook` → `handleStripeWebhook`

### 3. `ecommerce-api/src/routes/payment.routes.ts` (REFORMATTED)

- Expanded from minified single-line to readable multi-line
- Now imports `createStripeCheckout` instead of `createCheckout`

### 4. `ecommerce-api/src/models/order.model.ts` (REFORMATTED + MODIFIED)

- Expanded from minified single-line to readable multi-line format
- `paymentMethod` enum: removed `"razorpay"`, now `["stripe", "cod"]`

### 5. `ecommerce-api/src/models/shipping-detail.model.ts` (MODIFIED)

- `order` field: changed from `{ required: true }` to optional (no `required`)
- Allows creating a ShippingDetail before the Order document exists

### 6. `ecommerce-api/src/config/env.ts` (MODIFIED)

- Added `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (all optional)

### 7. `ecommerce-api/src/controllers/user.controller.ts` (MODIFIED)

- Added `as string` cast for `user.addresses.id(id)` calls in `updateAddress` and `deleteAddress`

## Frontend Changes

### 8. `ecommerce-client/src/app/checkout/page.tsx` (MODIFIED)

- **Submit buttons upgraded** — Framer Motion `motion.button` with spring animations (`whileTap`, `whileHover`), blue gradient background, shopping cart icon
- **Email in shipping payload** — `form.email` now included in `shippingAddress` object sent to API
- **useEffect deps** — `requireAuth` added to dependency array

### 9. `ecommerce-client/src/app/checkout/success/page.tsx` (MODIFIED)

- Supports `?order_number=` query param as fallback for displaying order number
- Cart `clear()` moved inside `.then()` — only clears after successful order fetch
- `requireAuth` added to useEffect deps

### 10. `ecommerce-client/src/app/login/page.tsx` (MODIFIED)

- **New `formatError()` helper** — Unified error formatting with network error detection
- **Auto-redirect** — If user is already authenticated (has token), redirects to account or `?redirect=` target
- **Google auth email verification** — Handles `EMAIL_NOT_VERIFIED` response from API by triggering OTP verification flow
- All error toasts now use `formatError()` for consistent messaging

### 11. `ecommerce-client/src/app/cart/page.tsx` (MODIFIED)

- **Toast fix** — `isSaved()` checked before `toggle()` to show correct "Saved for later" / "Removed from saved" message
- `requireAuth` added to useEffect deps

### 12. `ecommerce-client/src/app/products/[slug]/page.tsx` (MODIFIED)

- Added fallback image URL when `product.images[0]` is undefined

### 13. `ecommerce-client/src/components/site-header.tsx` | `ecommerce-client/src/services/api-client.ts` (MODIFIED)

- Search dropdown: removed `|| true` condition that made it always visible
- Refresh token endpoint: fixed URL to include `/api/v1/` prefix

### 14. React Hooks Dependency Fixes

All pages with `useRequireAuth` had `requireAuth` added to their `useEffect` dependency arrays:
- `app/account/orders/[id]/page.tsx`
- `app/account/orders/page.tsx`
- `app/place-order/page.tsx`
- `app/wishlist/page.tsx`

### 15. `ecommerce-client/eslint.config.mjs` (NEW)

- ESLint config file added for the frontend project
