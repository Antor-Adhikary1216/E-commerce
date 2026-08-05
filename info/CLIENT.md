# Client (ecommerce-client)

Next.js 15 App Router storefront with React 19, TypeScript, and Tailwind CSS.

---

## Pages and routes

| Route | Type | Component | Data source |
|-------|------|-----------|-------------|
| `/` | Server | `app/page.tsx` | `fetchCatalog({ limit: 6, sort: "rating" })` |
| `/login` | Client | `app/login/page.tsx` | Firebase client SDK |
| `/shop` | Server | `app/shop/page.tsx` | `Catalog` component (fetches categories + products) |
| `/sale` | Server | `app/sale/page.tsx` | `Catalog` with `feature: "flashSale"` |
| `/products/[slug]` | Server | `app/products/[slug]/page.tsx` | `fetchProduct(slug)` |
| `/cart` | Client | `app/cart/page.tsx` | localStorage cart context |
| `/wishlist` | Client | `app/wishlist/page.tsx` | localStorage wishlist context |
| `/account` | Client | `app/account/page.tsx` | Firebase `onAuthStateChanged` |
| `/account/orders` | Client | `app/account/orders/page.tsx` | `GET /orders` |
| `/account/orders/[id]` | Client | `app/account/orders/[id]/page.tsx` | `GET /orders/:id` |
| `/checkout/success` | Client | `app/checkout/success/page.tsx` | `GET /orders/session/:sessionId` |

### Root layout (`app/layout.tsx`)

- Inter font, metadata (title template `"%s | Vanta"`, description, OpenGraph)
- Wraps children in `<AppProviders>` (QueryClient, Theme, Cart, Wishlist, Toast)
- Renders `<SiteHeader>` above and `<SiteFooter>` below all pages
- Renders `<LoginPrompt>` (auto-appears after 1.8s for unauthenticated users)

### Home page (`/`)

Sections (top to bottom):
1. Category grid -- 8 hardcoded categories with images, linking to `/shop?category=<name>`
2. Hero banner -- green promo linking to `/sale`
3. "Today's best finds" -- 6 top-rated products from API
4. Three promo cards -- linking to `/sale`, `/shop?category=Furniture`, `/shop?category=Sneakers`
5. "For your short list" -- same 6 products reversed

---

## Components

### Layout components

| Component | File | Type | Description |
|-----------|------|------|-------------|
| `SiteHeader` | `components/site-header.tsx` | Client | Sticky dark header with logo, search, wishlist/cart badges, category nav |
| `SiteFooter` | `components/site-footer.tsx` | Server | Trust badges, 4-column link grid, newsletter form, copyright |
| `LoginPrompt` | `components/login-prompt.tsx` | Client | Auto-appearing modal for unauthenticated users |

### Product components

| Component | File | Type | Props | Description |
|-----------|------|------|-------|-------------|
| `ProductCard` | `components/product-card.tsx` | Client | `ProductCardData` | Product card with image, name, rating, price, wishlist toggle |
| `ProductCardSkeleton` | `components/product-card-skeleton.tsx` | Server | none | Shimmer skeleton for product cards |
| `ProductActions` | `components/product-actions.tsx` | Client | `CatalogProduct` | Add-to-cart button + wishlist toggle |
| `ProductGrid` | `components/motion/product-grid.tsx` | Client | `ProductCardData[]` | Staggered-animation grid of product cards |

### Catalog components

| Component | File | Type | Description |
|-----------|------|------|-------------|
| `Catalog` | `components/catalog.tsx` | Server | Category pills, sort options, product grid, pagination |
| `CatalogSkeleton` | `components/catalog-skeleton.tsx` | Server | Shimmer skeleton for catalog page |

### UI primitives

| Component | File | Description |
|-----------|------|-------------|
| `Button` | `components/ui/button.tsx` | CVA button with `default` and `outline` variants, rounded-full |
| `Skeleton` | `components/ui/skeleton.tsx` | Shimmer gradient animation div |
| `EmptyState` | `components/empty-state.tsx` | Centered icon + title + message + optional action link |
| `Reveal` | `components/motion/reveal.tsx` | Framer Motion scroll-triggered fade+translate entrance |
| `NewsletterForm` | `components/newsletter-form.tsx` | Email input + subscribe button (client-side toast only, no API) |

---

## State management

### Cart (`store/cart.tsx`)

- **Provider**: `CartProvider`, persisted to `localStorage` under key `vanta.cart`
- **Hook**: `useCart()` returns:
  - `items: CartItem[]` -- `{ product: ProductCardData, quantity }[]`
  - `count: number` -- total quantity across all items
  - `subtotal: number` -- sum of `finalPrice * quantity`
  - `add(product, quantity?)` -- adds or increments
  - `remove(slug)` -- removes by slug
  - `updateQuantity(slug, quantity)` -- sets quantity (removes if <= 0)
  - `clear()` -- empties cart

### Wishlist (`store/wishlist.tsx`)

- **Provider**: `WishlistProvider`, persisted to `localStorage` under key `vanta.saved`
- **Hook**: `useWishlist()` returns:
  - `items: ProductCardData[]`
  - `count: number`
  - `isSaved(slug)` -- checks if product is saved
  - `toggle(product)` -- adds/removes
  - `save(product)` / `remove(slug)`

---

## Data types

### `ProductCardData` (used by cards, cart, wishlist)

```typescript
{
  name: string;
  slug: string;
  price: number;
  finalPrice: number;
  rating: number;
  image: string;
  badge?: string;
}
```

### `CatalogProduct` (full product from API)

```typescript
{
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: { _id: string; name: string; slug: string };
  description: string;
  shortDescription: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  bestSeller: boolean;
  flashSale: boolean;
  newArrival: boolean;
}
```

### `CatalogCategory`

```typescript
{
  _id: string;
  name: string;
  slug: string;
  image?: string;
  count: number;
}
```

### `CatalogPagination`

```typescript
{ page: number; limit: number; total: number; pages: number }
```

---

## Lib utilities

| File | Exports | Description |
|------|---------|-------------|
| `lib/firebase.ts` | `firebaseApp`, `getFirebaseAuth()` | Lazy Firebase init, returns null if env vars missing |
| `lib/catalog.ts` | `fetchCatalog()`, `fetchCategories()`, `fetchProduct()`, `toCard()`, `productBadge()` | Server-side fetch helpers and type mappings |
| `lib/swal.ts` | `swal`, `addedToCart()`, `savedForLater()` | SweetAlert2 mixins with brand styling |
| `lib/token.ts` | `getAccessToken()`, `setAccessToken()`, `clearAccessToken()` | localStorage JWT management (key: `vanta.access-token`) |
| `lib/utils.ts` | `cn()`, `currency()` | Tailwind class merge + INR currency formatting |
| `lib/use-auth-user.ts` | `useAuthUser()` | Firebase `onAuthStateChanged` hook, returns `User \| null \| undefined` |
| `lib/use-require-auth.ts` | `useRequireAuth()` | Returns callback that checks auth, redirects to `/login` if not signed in |

---

## Services

### `services/api-client.ts`

Configured Axios instance:
- `baseURL`: `NEXT_PUBLIC_API_URL`
- `withCredentials: true`
- **Request interceptor**: attaches `Authorization: Bearer <token>` from localStorage
- **Response interceptor**: on 401, attempts `POST /auth/refresh` (via cookie), retries original request once with new token

---

## Providers (`providers/app-providers.tsx`)

Wraps the app in (outer to inner):
1. `ThemeProvider` (next-themes, `attribute="class"`, light default)
2. `MotionConfig` (framer-motion, `reducedMotion="user"`)
3. `QueryClientProvider` (TanStack Query, staleTime 60s, retry 1, no refetch on focus)
4. `CartProvider`
5. `WishlistProvider`
6. `Toaster` (react-hot-toast, top-right, 3.5s)

---

## Styling

- **Tailwind CSS** with custom CSS variables in `globals.css`
- **Color palette**: dark ink nav (`#1c2734`), warm canvas (`#f7f4ee`), lime green actions (`#16815d` / `#d8ef72`)
- **Typography**: Inter font, 12px base, antialiased
- **Focus**: `focus-visible:ring-2 ring-[#16815d] ring-offset-2`
- **Animations**: Framer Motion with scroll-triggered `Reveal` (fade+translate, 0.55s, custom ease), staggered `ProductGrid`
- **Skeletons**: shimmer gradient animation (`skeleton-shimmer` keyframe, 1.6s infinite)
- **Motion**: `reducedMotion="user"` respects OS preference

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | API base URL (e.g. `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | No | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | No | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase Web App ID |

---

## Key behaviors

- **Server rendering**: Pages are server-rendered by default. Client components are marked `"use client"` for interactivity (cart, wishlist, auth, checkout).
- **Search**: The header search input is not yet wired to the API.
- **Cart checkout**: Redirects to Stripe Checkout. On return, `/checkout/success` clears the cart and shows the order.
- **Login prompt**: Auto-appears after 1.8 seconds for unauthenticated users (not on `/login` or `/account`). Dismissable via sessionStorage.
- **Wishlist**: Requires authentication. Heart toggle appears on product cards and product detail pages.
- **Currency**: INR formatted via `Intl.NumberFormat("en-IN")`.
