# Changes Made — Shipping Details Step

## Summary

Added a new `/checkout` route that collects the user's shipping information (name, email, phone, address) before redirecting to Stripe payment. This sits between the item selection page and the Stripe checkout.

## Files Modified

### 1. `ecommerce-client/src/app/checkout/page.tsx` (NEW)

- New shipping details form page
- Fields: Full Name, Email, Phone, Address Line 1 & 2, City, State, Postal Code, Country
- Pre-fills name and email from Firebase auth (`displayName`, `email`)
- Pre-fills phone from user profile API
- Reads selected items from URL query params (`?items=slug1,slug2`)
- Shows order summary sidebar with item images, quantities, pricing
- On submit, calls `POST /payments/create-checkout` with `{ items, shippingAddress }` and redirects to Stripe
- Auth-protected via `useRequireAuth`
- Wrapped in `<Suspense>` for `useSearchParams()` compatibility

### 2. `ecommerce-client/src/app/place-order/page.tsx` (MODIFIED)

- "Proceed to Payment" button now navigates to `/checkout?items=slug1,slug2` instead of calling the Stripe API directly
- Removed `checkingOut` state, `apiClient` import, and `swal` import (no longer needed)

### 3. `ecommerce-api/src/controllers/payment.controller.ts` (MODIFIED)

- `createCheckout` now reads `shippingAddress` from the request body
- Saves `shippingAddress` to the Order document (using the existing `shippingAddress: Schema.Types.Mixed` field)

## Pre-existing Modified Files (from earlier work)

- `ecommerce-client/src/app/cart/page.tsx`
- `ecommerce-client/src/components/cart-item-card.tsx`
- `ecommerce-client/src/components/price-details.tsx`
- `ecommerce-client/src/components/select-item-card.tsx`
