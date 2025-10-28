import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Named export: `protect`
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Extract token from Authorization header
    const header = req.header("Authorization");
    if (header && header.startsWith("Bearer ")) {
      token = header.replace("Bearer ", "").trim();
    }

    // 2️⃣ Also allow token via query or body (optional)
    else if (req.query.token) {
      token = req.query.token;
    } else if (req.body.token) {
      token = req.body.token;
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Find the user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token, user not found" });
    }

    // 6️⃣ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ authMiddleware error:", err.message);
    res.status(401).json({ message: "Unauthorized or invalid token" });
  }
};
