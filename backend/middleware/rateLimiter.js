import rateLimit from "express-rate-limit";

// Rate limiter for admin login endpoint (protect against brute force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
});

// Rate limiter for public contact & quotation form submissions (prevent spam)
export const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submission attempts. Please try again after some time or contact us by phone.",
  },
});

export default { loginLimiter, publicFormLimiter };
