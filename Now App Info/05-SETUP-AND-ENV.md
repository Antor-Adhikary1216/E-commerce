# Environment Variables & Setup

## Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCjDNITj9npGvRgwt86pKBH_95W8hmQn04
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=e-commerce-c35b7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=e-commerce-c35b7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=e-commerce-c35b7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=20904422366
NEXT_PUBLIC_FIREBASE_APP_ID=1:20904422366:web:2c010835076feb430dcb4f
```

## API (.env)
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
FIREBASE_PROJECT_ID=<project_id>
FIREBASE_CLIENT_EMAIL=<service_account_email>
FIREBASE_PRIVATE_KEY=<private_key>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_ACCESS_SECRET=<random_secret>
JWT_REFRESH_SECRET=<random_secret>
```

## Running Locally

### API
```bash
cd ecommerce-api
npm install
npm run dev          # Starts on :5000 with tsx watch
```

### Client
```bash
cd ecommerce-client
npm install
npm run dev          # Starts on :3000
```

## Key Ports
| Service | Port |
|---------|------|
| Next.js client | 3000 |
| Express API | 5000 |
| MongoDB Atlas | 27017 (cloud) |

## Dependencies

### Client
- next@15, react@19, react-dom@19
- tailwindcss, autoprefixer, postcss
- framer-motion (animations)
- lucide-react (icons)
- axios (HTTP client)
- firebase (auth SDK)
- zustand (state) — via React Context
- sweetalert2 (toast notifications)
- react-icons (FiEye/FiEyeOff for password toggle)

### API
- express@5, cors, helmet, cookie-parser
- mongoose@8 (MongoDB ODM)
- firebase-admin (server auth)
- jsonwebtoken (JWT)
- zod (validation)
- stripe (payments)
- morgan (logging)
- express-rate-limit (rate limiting)
- mongo-sanitize (NoSQL injection prevention)
