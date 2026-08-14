# E-Commerce Platform — Project Overview

A full-stack e-commerce application with a Next.js 15 frontend (App Router) and Express 5 backend, using MongoDB, Stripe payments, and Firebase authentication.

## Architecture

```
ecommerce-client/          # Frontend — Next.js 15, React 19, Tailwind CSS
ecommerce-api/             # Backend — Express 5, Mongoose, Stripe SDK
```

## Key Features

- Product browsing, search, and filtering
- Shopping cart with localStorage persistence
- Wishlist / save-for-later
- Multi-step checkout flow (cart → item selection → shipping details → Stripe payment)
- User authentication (Firebase: email/password, Google, OTP)
- User profile and address management
- Order history and tracking
- Responsive design with Framer Motion animations

## Checkout Flow (Current)

```
/cart  →  /place-order  →  /checkout (shipping form)  →  [Stripe Checkout]  →  /checkout/success
```

1. **Cart** — Review items, adjust quantities, save for later
2. **Place Order** — Select which items to purchase
3. **Checkout** — Enter shipping details (name, email, phone, address)
4. **Stripe** — Hosted payment page
5. **Success** — Order confirmation, cart cleared

## Payment Methods

| Method | Status |
|---|---|
| Stripe | Active |
| Cash on Delivery | Active |
| Razorpay | Planned (env vars defined) |

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/payments/create-checkout` | POST | Create Stripe checkout session |
| `/api/v1/payments/webhook/stripe` | POST | Stripe webhook handler |
| `/api/v1/auth/send-otp` | POST | Send email verification OTP |
| `/api/v1/auth/refresh` | POST | Refresh access token |
