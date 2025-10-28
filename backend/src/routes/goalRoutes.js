import express from "express";
import { 
  getGoals, 
  addGoal, 
  updateGoal, 
  deleteGoal, 
  deleteContribution 
} from "../controllers/goalController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Protect all routes
router.use(protect);

// ✅ Now only the logged-in user’s goals are accessible
router.get("/", getGoals);
router.post("/", addGoal);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.delete("/:id/contributions/:cid", deleteContribution);

export default router;
