# Features Implemented

## 1. Authentication System
- Firebase Auth (email/password) on client
- JWT access token (15 min) + refresh token (30 day HTTP-only cookie)
- Token exchange: Firebase ID token → API JWT
- Auto-refresh interceptor on Axios client
- Auth guards: `useRequireAuth()` hook for protected pages
- Logout clears: Firebase session, API session, localStorage (cart, wishlist, tokens)

## 2. Navbar (site-header.tsx)
- **Logo**: Custom SVG "Shopping India" with shopping bag icon
- **Search bar**: Full working search with dropdown
  - Recent searches (saved to localStorage, max 10)
  - Live suggestions (filters history as you type)
  - Popular search tags (iPhone, Samsung, Headphones, etc.)
  - Individual history remove (X button) + Clear all
  - Water blur backdrop effect (portal to body, blurs page, leaves search clear)
- **Icons**: Heart (wishlist), Cart, Profile — hidden when logged out
- **Sign in button**: Shown when logged out
- **Profile photo**: Shows Firebase photoURL or fallback icon
- iOS-style frosted glass: `backdrop-blur-xl` + semi-transparent background
- Larger size: h-20, bigger icons (22px), more padding

## 3. Product Cards
- Image with hover zoom effect
- Badge (Best seller, Flash sale, New, Featured)
- Star rating display
- Discount percentage
- Price (with strikethrough original)
- **Add to Cart** button (outlined green) — adds to cart, stays on page
- **Buy Now** button (solid green) — adds to cart, navigates to /cart
- Wishlist heart button (requires auth)

## 4. Search System
- `/search?q=...` page using Catalog component
- MongoDB text search on name, brand, tags fields
- "Coming Soon" message when no results found
- Search history persisted in localStorage

## 5. Shopping Cart
- localStorage persistence
- Add/remove/update quantity
- Cart count badge on navbar
- Requires authentication

## 6. Wishlist
- localStorage persistence
- Save/unsave products
- Count badge on navbar
- Requires authentication
- SweetAlert2 feedback

## 7. User Profile (/account)
- Profile view: name, email, phone, gender, birthday, avatar
- **Edit profile**: Opens form with all fields
  - Name, phone, gender (dropdown), birthday (date picker)
  - **Photo upload**: File input → base64 data URL (2MB max)
  - Remove photo button
  - Error feedback display
- **Address management**:
  - Add new address (label, name, street, city, state, PIN, country, phone)
  - Edit existing address
  - Delete address
- Sign out button
- Requires authentication

## 8. Profile Photo Upload
- File input (accepts image/*)
- Client-side FileReader → base64 data URL
- 2MB file size limit
- Stored as `avatar` field in MongoDB User document
- Displayed in navbar and profile page
- API body limit increased to 3mb for base64 data

## 9. API Validation (Zod)
- All routes validated with Zod schemas
- Profile update: accepts empty strings (converts to null in controller)
- Address CRUD: full validation
- Auth routes: email/password validation

## 10. UI/UX
- Base font size: 14px (increased from 12px)
- Frosted glass navbar (backdrop-blur-xl)
- Smooth animations (Framer Motion)
- Responsive design (mobile-first)
- Empty states with icons and CTAs
- Toast notifications (SweetAlert2)
