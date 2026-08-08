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
