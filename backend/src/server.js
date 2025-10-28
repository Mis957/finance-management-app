// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import connectMongo from "./config/mongo.js"; // ✅ MongoDB connection
import splitRoutes from "./routes/splitRoutes.js";
import { scheduleWeeklyReminders } from "./jobs/weeklyReminders.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";



// after connectMongo() and app.listen...



/* ---------------------------- 🛠 ROUTES ---------------------------- */
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"; // ✅ Transactions API
import goalRoutes from "./routes/goalRoutes.js"; // ✅ ADD THIS 🔥

dotenv.config();
const app = express();

/* ------------------------- 🔧 MIDDLEWARE ------------------------- */
app.use(express.json());

// ✅ CORS — allow your frontend URLs
app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  })
);

// ✅ Express session (needed for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true only for HTTPS
  })
);

// ✅ Passport initialization
app.use(passport.initialize());
app.use(passport.session());

/* ---------------------------- 🧭 ROUTES ---------------------------- */
app.use("/api/auth", authRoutes); // Login / Register / Google Auth
app.use("/api/transactions", transactionRoutes); // Income / Expense API
app.use("/api/splits", splitRoutes); // ✅ Splitwise-style feature
app.use("/api/goals", goalRoutes); // ✅ ✅ ADD THIS — FIXES TARGETS ERRORS 🔥🔥🔥
app.use("/api/categories", categoryRoutes);
app.use("/api/reminders", reminderRoutes);
/* ---------------------------- 🧪 TEST ROUTE ---------------------------- */
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

/* ---------------------------- 🚀 SERVER START ---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);

  // ✅ MongoDB connection
  await connectMongo();
});

console.log("🌐 Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);
scheduleWeeklyReminders();

import { sendEmail } from "./utils/emailService.js";

app.get("/api/test-email", async (req, res) => {
  await sendEmail(
    "mymishri27@gmail.com",
    "Test Email from Finance App",
    "<h2>✅ Email service is working!</h2><p>Hello from your backend 🚀</p>"
  );
  res.json({ message: "Email sent!" });
});

import notificationRoutes from "./routes/notificationRoutes.js";
app.use("/api/notifications", notificationRoutes);
