# API Reference — Checkout Endpoint

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
| `shippingAddress` | No | Object with shipping details (saved to order) |

### Response

```json
{
  "url": "https://checkout.stripe.com/...",
  "orderNumber": "VNT-202608-ABC123"
}
```

### Flow

1. Validates items exist in database
2. Creates an Order document with `shippingAddress`
3. Creates a Stripe Checkout Session with line items
4. Returns the Stripe Checkout URL for redirect
5. On payment success, Stripe webhook marks order as `confirmed`
