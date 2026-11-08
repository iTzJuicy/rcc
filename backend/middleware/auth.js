import jwt from "jsonwebtoken";
import User from "../models/User.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET environment variable is missing. Server cannot verify credentials.");
  }
  return secret;
}

export async function protectAdmin(req, res, next) {
  let token = null;

  // 1. Check Authorization Bearer header first (primary authentication for SPA)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Fall back to HttpOnly cookie
  else if (req.cookies && req.cookies.rcc_token) {
    token = req.cookies.rcc_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in.",
    });
  }

  try {
    const secret = getJwtSecret();
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (tokenErr) {
      // If header token was invalid/expired, try cookie if available
      if (req.cookies && req.cookies.rcc_token && token !== req.cookies.rcc_token) {
        decoded = jwt.verify(req.cookies.rcc_token, secret);
      } else {
        throw tokenErr;
      }
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session not found or account deleted.",
      });
    }

    // Invalidate token if password was changed (tokenVersion mismatch)
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Session expired because password was changed. Please sign in again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authorization token.",
    });
  }
}

/**
 * Middleware to check specific section permission
 * @param {string} permissionKey - e.g. "services", "projects", "users", "settings", "enquiries"
 */
export function requirePermission(permissionKey) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Superadmin and Admin have all permissions; editors use explicit grants.
    if (req.user.role === "superadmin" || req.user.role === "admin") {
      return next();
    }

    const editorPermissions = [
      "services",
      "projects",
      "categories",
      "testimonials",
      "stats",
      "enquiries",
      "media",
    ];
    if (
      req.user.role === "editor" &&
      editorPermissions.includes(permissionKey) &&
      req.user.permissions?.[permissionKey] === undefined
    ) {
      return next();
    }

    // Check specific permission flag
    if (req.user.permissions && req.user.permissions[permissionKey] === true) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. You do not have permission to manage ${permissionKey}.`,
    });
  };
}

export default protectAdmin;
