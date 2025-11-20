import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.json({ message: "User registered successfully", token, user });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google callback
// Google callback
export const googleCallback = (req, res) => {
  try {
    // create a JWT for the user (req.user should be the user object from passport)
    const token = generateToken(req.user);

    // Use FRONTEND_URL env var in production; fallback to localhost for local dev
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Redirect to the deployed dashboard (no /project prefix — the published root is frontend/project)
    return res.redirect(`${frontend}/dashboard.html?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error('Google callback error:', err);
    return res.status(500).send('Authentication error');
  }
};

