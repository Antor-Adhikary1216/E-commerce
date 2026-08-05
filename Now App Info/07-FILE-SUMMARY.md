# File Summary — Key Files Modified

## Frontend (ecommerce-client/src/)

### Components
| File | Purpose |
|------|---------|
| `components/site-header.tsx` | Navbar: logo, search with dropdown/history/suggestions, auth-gated icons, iOS blur |
| `components/site-footer.tsx` | Footer with Shopping India logo, links, copyright |
| `components/logo.tsx` | Custom SVG logo (shopping bag + "Shopping India" text) |
| `components/product-card.tsx` | Product card: image, badge, rating, price, Add to Cart, Buy Now, wishlist |
| `components/catalog.tsx` | Product grid with category filters, sort, pagination |
| `components/empty-state.tsx` | Reusable empty state with icon, title, message, CTA |

### Pages
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with metadata ("Shopping India") |
| `app/page.tsx` | Homepage |
| `app/search/page.tsx` | Search results page (uses Catalog, shows "Coming Soon") |
| `app/account/page.tsx` | Profile edit, address management, photo upload |
| `app/login/page.tsx` | Login/signup with password visibility toggle |
| `app/cart/page.tsx` | Shopping cart (auth-gated) |
| `app/wishlist/page.tsx` | Saved items (auth-gated) |

### Lib
| File | Purpose |
|------|---------|
| `lib/use-search-history.ts` | Search history hook (localStorage, add/remove/clear) |
| `lib/use-auth-user.ts` | Firebase auth state hook |
| `lib/use-require-auth.ts` | Auth guard hook with redirect |
| `lib/token.ts` | JWT access token management |
| `lib/firebase.ts` | Firebase config |
| `lib/catalog.ts` | API fetch helpers (products, categories) |

### Store
| File | Purpose |
|------|---------|
| `store/cart.tsx` | Cart context + localStorage persistence |
| `store/wishlist.tsx` | Wishlist context + localStorage persistence |

### Services
| File | Purpose |
|------|---------|
| `services/api-client.ts` | Axios with token refresh interceptor |

---

## Backend (ecommerce-api/src/)

### Core
| File | Purpose |
|------|---------|
| `app.ts` | Express setup (3mb body limit, CORS, rate limiting, routes) |
| `server.ts` | Server entry |

### Models
| File | Purpose |
|------|---------|
| `models/user.model.ts` | User schema (avatar, addresses, gender, DOB) |
| `models/product.model.ts` | Product schema (text index on name, brand, tags) |
| `models/category.model.ts` | Category schema |

### Routes
| File | Purpose |
|------|---------|
| `routes/user.routes.ts` | Profile CRUD + address CRUD (Zod validated) |
| `routes/product.routes.ts` | Product list + detail (supports ?q= search) |
| `routes/auth.routes.ts` | Login/refresh/logout |

### Controllers
| File | Purpose |
|------|---------|
| `controllers/user.controller.ts` | Profile update (converts "" → null), address CRUD |
| `controllers/product.controller.ts` | Product listing with search, filter, sort, pagination |

### Middleware
| File | Purpose |
|------|---------|
| `middleware/auth.ts` | JWT verification middleware |
| `middleware/error.ts` | Error handler |
