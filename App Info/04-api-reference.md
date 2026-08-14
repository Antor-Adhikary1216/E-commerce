# API Reference — Checkout & Webhook Endpoints

## POST /api/v1/payments/create-checkout

Creates a Stripe Checkout session and an order record.

### Request

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    { "slug": "product-slug", "quantity": 2 }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "line1": "123 Main Street",
    "line2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  }
}
```

| Field | Required | Description |
|---|---|---|
| `items` | Yes | Array of `{ slug, quantity }` objects |
| `shippingAddress` | No | Object with shipping details (saved to order and ShippingDetail) |

### Response

```json
{
  "url": "https://checkout.stripe.com/...",
  "orderNumber": "VNT-202608-ABC123"
}
```

### Flow

1. Validates items exist in database
2. Creates a ShippingDetail document (if address provided)
3. Creates an Order document with `shippingAddress` and `shippingDetail` ref
4. Links ShippingDetail back to the Order
5. Creates a Stripe Checkout Session with line items
6. Returns the Stripe Checkout URL for redirect
7. On payment success, Stripe webhook marks order as `confirmed`

### Error Responses

| Status | Message |
|---|---|
| 422 | `"Items are required"` |
| 400 | `"Unknown products: slug1, slug2"` |
| 400 | `"Checkout failed"` (any Stripe error) |
| 503 | `"Stripe is not configured on the API"` |

---

## POST /api/v1/payments/webhook/stripe

Stripe webhook endpoint for handling payment events.

### Request

**Headers:**
```
stripe-signature: <stripe_signature>
Content-Type: application/json
```

**Body:** Raw Stripe event payload (requires `express.raw` middleware)

### Events Handled

| Event | Action |
|---|---|
| `checkout.session.completed` | Order → `paymentStatus: "paid"`, `status: "confirmed"` |
| `checkout.session.expired` | Order → `paymentStatus: "failed"` |
| `checkout.session.async_payment_failed` | Order → `paymentStatus: "failed"` |

### Response

```json
{ "received": true }
```

### Error Responses

| Status | Message |
|---|---|
| 400 | `"Missing signature"` |
| 400 | `"Invalid signature"` |
| 503 | `"Stripe webhooks are not configured"` |

---

## Payment Methods

The `paymentMethod` field on Order supports:
- `"stripe"` — Stripe Checkout (hosted payment page)
- `"cod"` — Cash on Delivery

> Note: Razorpay support is planned but currently disabled in the payment method enum.
