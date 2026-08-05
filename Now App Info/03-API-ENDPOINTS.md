# API Endpoints

Base URL: `http://localhost:5000/api/v1`

## Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Exchange Firebase ID token for JWT |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Clear refresh token cookie |

## Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (supports `?q=`, `?category=`, `?sort=`, `?page=`) |
| GET | `/products/:slug` | Get single product by slug |

### Query Parameters for /products
- `q` — Text search (matches name, brand, tags)
- `category` — Filter by category slug or name
- `brand` — Filter by brand
- `sort` — `price_asc`, `price_desc`, `rating`, `latest` (default)
- `page` — Page number (default: 1)
- `limit` — Items per page (max 48, default 16)
- `feature` — Filter by feature flag (featured, bestSeller, flashSale, newArrival)

## Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories with product counts |

## User (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get current user profile |
| PUT | `/user/profile` | Update profile (name, phone, gender, dateOfBirth, avatar) |
| POST | `/user/addresses` | Add new address |
| PUT | `/user/addresses/:id` | Update address |
| DELETE | `/user/addresses/:id` | Delete address |

## Orders (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List user orders |
| GET | `/orders/:id` | Get order details |

## Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/create-checkout-session` | Create Stripe checkout session |
| POST | `/payments/webhook` | Stripe webhook handler |

## Request/Response Examples

### Profile Update
```json
PUT /api/v1/user/profile
Authorization: Bearer <jwt_token>

{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "gender": "male",
  "dateOfBirth": "1990-01-15",
  "avatar": "data:image/jpeg;base64,..."
}

Response:
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "avatar": "data:image/jpeg;base64,...",
    "addresses": []
  }
}
```

### Product Search
```json
GET /api/v1/products?q=phone&sort=rating&page=1

Response:
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 16,
    "total": 5,
    "pages": 1
  }
}
```
