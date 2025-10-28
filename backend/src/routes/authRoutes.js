import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs"; // ✅ Added this import
import jwt from "jsonwebtoken";
import { registerUser, loginUser, googleCallback } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// =====================
// 🔹 Google Login Flow
// =====================
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// =====================
// 🔹 Email/Password Login
// =====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================
// 🔹 Google Callback
// =====================
router.get(
  "/google/callback",
  passport.authenticate("google", {
     scope: ["profile", "email"],
    prompt: "select_account",
    failureRedirect: "http://localhost:3000/project/login/login.html",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:3000/project/dashboard.html?token=${token}`);
  }
);

// =====================
// 🔹 Logout Route
// =====================
router.get("/logout", (req, res) => {
  req.logout?.(() => {
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;
