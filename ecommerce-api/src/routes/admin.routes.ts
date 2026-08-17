import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  getDashboardStats,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listAllOrders,
  updateOrderStatus,
  listUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require admin role
router.use(requireAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Products
router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", listAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", listUsers);
router.put("/users/:id/role", updateUserRole);

export default router;
