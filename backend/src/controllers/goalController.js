import Goal from "../models/Goal.js";

// ✅ Get all goals for a user
export const getGoals = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const goals = await Goal.find({ userId }).sort({ priority: 1, deadline: 1, createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error("❌ getGoals Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create a new goal
export const addGoal = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const { title, type, targetAmount, amountSaved, deadline, priority } = req.body;
    if (!title || !targetAmount) {
      return res.status(400).json({ error: "title and targetAmount are required" });
    }

    const goal = new Goal({
      userId,
      title,
      type: type || "monthly",
      targetAmount: Number(targetAmount),
      amountSaved: Number(amountSaved || 0),
      deadline: deadline || null,
      priority: priority || "medium",
      contributions: amountSaved
        ? [
            {
              id: `c_${Date.now().toString(36)}`,
              amount: Number(amountSaved),
              note: "Initial Contribution",
              date: new Date(),
            },
          ]
        : [],
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error("❌ addGoal Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Add a contribution to a goal
export const addContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, note } = req.body;
    const goal = await Goal.findById(id);

    if (!goal) return res.status(404).json({ error: "Goal not found" });

    const contribution = {
      id: `c_${Date.now().toString(36)}`,
      amount: Number(amount),
      note: note || "",
      date: new Date(),
    };

    goal.contributions.unshift(contribution);
    goal.amountSaved += Number(amount);

    await goal.save();
    res.status(200).json(goal);
  } catch (err) {
    console.error("❌ addContribution Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update a whole goal (not used for adding contributions anymore)
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    res.json(goal);
  } catch (err) {
    console.error("❌ updateGoal Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteGoal Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a contribution from a goal
export const deleteContribution = async (req, res) => {
  try {
    const { id, cid } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.contributions = goal.contributions.filter((c) => c.id !== cid);
    goal.amountSaved = goal.contributions.reduce((sum, c) => sum + c.amount, 0);

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error("❌ deleteContribution Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
