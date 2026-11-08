import express from "express";
import {
  login,
  logout,
  getProfile,
  changePassword,
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from "../controllers/authController.js";
import { protectAdmin, requirePermission } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/profile", protectAdmin, getProfile);
router.post("/change-password", protectAdmin, changePassword);

// User & Permissions management
router.get("/users", protectAdmin, requirePermission("users"), adminGetUsers);
router.post("/users", protectAdmin, requirePermission("users"), adminCreateUser);
router.put("/users/:id", protectAdmin, requirePermission("users"), adminUpdateUser);
router.delete("/users/:id", protectAdmin, requirePermission("users"), adminDeleteUser);

export default router;
