# API Reference

Base URL: `http://localhost:5000/api/v1` (development)

All responses are JSON. Authenticated endpoints require `Authorization: Bearer <accessToken>` header.

---

## Health

### `GET /health`

Returns service health status.

**Response**: `{ "status": "ok" }`

---

## Authentication

### `POST /auth/exchange`

Verifies a Firebase ID token and issues JWT access + refresh tokens.

**Request body**:
```json
{
  "idToken": "string (required)",
  "profile": {
    "phone": "string (optional)",
    "gender": "male | female | other (optional)",
    "dateOfBirth": "string (optional)"
  }
}
```

**Success (200)**:
```json
{
  "accessToken": "jwt-string",
  "user": {
    "id": "mongo-id",
    "name": "string",
    "email": "string",
    "avatar": "string | null",
    "role": "customer | admin",
    "emailVerified": true,
    "phone": "string | null",
    "gender": "male | female | other | null",
    "dateOfBirth": "string | null"
  }
}
```

Sets `refreshToken` HTTP-only cookie (30 day expiry, path `/api/v1/auth`, sameSite strict).

**Errors**:
- `422` -- missing `idToken`
- `503` -- Firebase not configured
- `401` -- invalid Firebase token
- `403` -- `{ "code": "EMAIL_NOT_VERIFIED" }` (email not yet verified via OTP)

---

### `POST /auth/refresh`

Issues a new access token from a valid refresh cookie.

**Request**: Uses `refreshToken` cookie (set by `/auth/exchange`).

**Success (200)**:
```json
{ "accessToken": "new-jwt-string" }
```

**Error (401)**: No cookie, invalid token, or hash mismatch.

---

### `POST /auth/logout`

Clears the refresh cookie.

**Response**: `204 No Content`

---

### `POST /auth/send-otp`

Sends a 6-digit verification code to the given email.

**Request body**:
```json
{ "email": "user@example.com" }
```

**Success (200)**:
```json
{ "message": "Verification code sent" }
```

**Errors**:
- `422` -- invalid email format
- `429` -- rate limited (1 per minute per address)

**Notes**: Code expires in 10 minutes. Max 5 verification attempts. Without SMTP config, the code is logged to the API console.

---

### `POST /auth/verify-otp`

Verifies a 6-digit OTP code.

**Request body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Success (200)**:
```json
{ "verified": true, "message": "Email verified" }
```

**Errors**:
- `400` -- expired or invalid code
- `429` -- locked (too many attempts)

---

## Products

### `GET /products`

Lists products with filtering, search, sorting, and pagination.

**Query parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (min 1) |
| `limit` | number | 16 | Items per page (1--48) |
| `q` | string | | Full-text search (name, brand, tags) |
| `category` | string | | Category slug or name |
| `brand` | string | | Brand name |
| `feature` | string | | Boolean feature flag (`featured`, `bestSeller`, `flashSale`, `newArrival`) |
| `sort` | string | `latest` | Sort: `latest`, `price_asc`, `price_desc`, `rating` |

**Success (200)**:
```json
{
  "items": [
    {
      "_id": "mongo-id",
      "name": "Product Name",
      "slug": "product-name",
      "brand": "Brand",
      "price": 1999,
      "discount": 10,
      "finalPrice": 1799,
      "rating": 4.5,
      "reviewCount": 42,
      "images": ["https://..."],
      "category": { "_id": "...", "name": "Electronics", "slug": "electronics" },
      "description": "...",
      "shortDescription": "...",
      "colors": ["Black", "White"],
      "sizes": ["S", "M", "L"],
      "featured": false,
      "bestSeller": true,
      "flashSale": false,
      "newArrival": false,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 16,
    "total": 144,
    "pages": 9
  }
}
```

---

### `GET /products/:slug`

Returns a single product by slug with populated category.

**Success (200)**: Full product object with `category` populated as `{ _id, name, slug }`.

**Error (404)**: `{ "message": "Product not found" }`

---

## Categories

### `GET /categories`

Returns all non-empty categories with product counts, sorted alphabetically.

**Success (200)**:
```json
{
  "items": [
    {
      "_id": "mongo-id",
      "name": "Mobiles",
      "slug": "mobiles",
      "image": "https://...",
      "count": 9
    }
  ]
}
```

---

## Orders

All order endpoints require authentication (`Authorization: Bearer <token>`).

### `GET /orders`

Returns all orders for the authenticated user, sorted newest first.

**Success (200)**:
```json
{
  "orders": [
    {
      "_id": "mongo-id",
      "orderNumber": "VNT-202608-ABC123",
      "status": "confirmed",
      "paymentMethod": "stripe",
      "paymentStatus": "paid",
      "items": [
        {
          "product": "mongo-id",
          "name": "Product Name",
          "image": "https://...",
          "price": 1799,
          "quantity": 2
        }
      ],
      "total": 3598,
      "createdAt": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```

---

### `GET /orders/:id`

Returns a single order by ID (must belong to the authenticated user).

**Success (200)**:
```json
{
  "order": {
    "_id": "...",
    "orderNumber": "VNT-202608-ABC123",
    "status": "shipped",
    "paymentMethod": "stripe",
    "paymentStatus": "paid",
    "items": [...],
    "subtotal": 3598,
    "discount": 0,
    "shippingCost": 0,
    "tax": 0,
    "total": 3598,
    "shippingAddress": { ... },
    "createdAt": "..."
  }
}
```

**Error (404)**: `{ "message": "Order not found" }`

---

### `GET /orders/session/:sessionId`

Returns an order by Stripe session ID (must belong to the authenticated user).

**Success (200)**:
```json
{ "order": { "orderNumber": "...", "status": "...", "total": ... } }
```

**Error (404)**: `{ "message": "Order not found" }`

---

## Payments

### `POST /payments/create-checkout`

Creates a Stripe Checkout Session and a pending order.

**Auth**: Required.

**Request body**:
```json
{
  "items": [
    { "slug": "product-slug", "quantity": 2 }
  ]
}
```

**Success (200)**:
```json
{
  "url": "https://checkout.stripe.com/...",
  "orderNumber": "VNT-202608-ABC123"
}
```

**Errors**:
- `422` -- items missing or empty
- `400` -- unknown product slugs
- `503` -- Stripe not configured

**Notes**: Order number format is `VNT-YYYYMM-XXXXXX`. Stripe session expires in 30 minutes. Currency is INR.

---

### `POST /payments/webhook`

Stripe webhook handler. Mounted with `express.raw()` body parser.

**Handles events**:
- `checkout.session.completed` -- marks order as `paid` + `confirmed`
- `checkout.session.expired` / `checkout.session.async_payment_failed` -- marks order as `failed`

**Response**: `{ "received": true }`

**Errors**:
- `503` -- Stripe not configured
- `400` -- missing or invalid signature

---

## Error response format

All errors return:
```json
{
  "message": "Human-readable error message",
  "issues": [...]  // only for ZodError (422)
}
```

Status codes: `400` bad request, `401` unauthorized, `403` forbidden, `404` not found, `422` validation error, `429` rate limited, `500` internal error, `503` service unavailable.
