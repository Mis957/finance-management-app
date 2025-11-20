import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerUser, loginUser, googleCallback } from "../controllers/authController.js"; // if you still use googleCallback, otherwise inline
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Start Google auth (strategy callbackURL is read from passport config)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Email/password login (unchanged)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Google callback — uses FRONTEND_URL env var and does NOT hardcode localhost
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: (process.env.FRONTEND_URL || "http://localhost:3000") + "/login/login.html",
    session: false,
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
      // Redirect to the deployed dashboard (no /project prefix)
      return res.redirect(`${frontend}/dashboard.html?token=${encodeURIComponent(token)}`);
    } catch (err) {
      console.error("Google callback handler error:", err);
      return res.status(500).send("Authentication error");
    }
  }
);

// Logout (unchanged)
router.get("/logout", (req, res) => {
  req.logout?.(() => {
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;
