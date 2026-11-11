import jwt from "jsonwebtoken";
import User from "../models/User.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return secret;
}

function generateToken(user) {
  const secret = getJwtSecret();
  return jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion || 0 },
    secret,
    { expiresIn: "7d" }
  );
}

function setAuthCookie(res, token) {
  res.cookie("rcc_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    setAuthCookie(res, token);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie("rcc_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
}

export async function getProfile(req, res) {
  res.json({
    success: true,
    data: req.user,
  });
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password does not match our records.",
      });
    }

    user.password = newPassword;
    // Invalidate all previously issued tokens
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Issue new token and cookie for the current session
    const newToken = generateToken(user);
    setAuthCookie(res, newToken);

    res.json({
      success: true,
      token: newToken,
      message: "Password updated successfully. Other active sessions have been invalidated.",
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// USER MANAGEMENT & PERMISSIONS (Admin Only)
// ============================================================

export async function adminGetUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateUser(req, res, next) {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password (min 8 chars) are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user with that email already exists.",
      });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || "admin",
      permissions: permissions || {
        services: true,
        projects: true,
        categories: true,
        testimonials: true,
        stats: true,
        enquiries: true,
        media: true,
        settings: false,
        users: false,
      },
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, data: userObj });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, permissions, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (permissions) user.permissions = { ...user.permissions, ...permissions };

    if (password && password.length >= 8) {
      user.password = password;
      user.tokenVersion = (user.tokenVersion || 0) + 1;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, data: userObj });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (String(req.user._id) === String(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own logged-in account.",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  logout,
  getProfile,
  changePassword,
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
};
