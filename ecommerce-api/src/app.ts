import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoSanitize from "mongo-sanitize";
import { env } from "./config/env.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { handleStripeWebhook } from "./controllers/payment.controller.js";
import { errorHandler } from "./middleware/error.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60_000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api/v1/payments/webhook/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());
app.use((req, _, next) => {
  if (req.body && !Buffer.isBuffer(req.body)) req.body = mongoSanitize(req.body);
  for (const key of Object.keys(req.query)) {
    req.query[key] = mongoSanitize(req.query[key]);
  }
  next();
});
app.get("/health", (_, res) => res.json({ status: "ok" }));
const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", (_, res) => res.status(404).json({ message: "Not found" }));
app.use(errorHandler);
