// src/jobs/weeklyReminders.js
import cron from "node-cron";
import { sendEmail } from "../utils/emailService.js";
import { buildWeeklyGoalEmail } from "../utils/mailer.js";

import Goal from "../models/Goal.js";
import User from "../models/User.js"; // adapt to your User model path

const TZ = process.env.CRON_TZ || "Asia/Kolkata";

/**
 * findActiveGoalsGroupedByUser()
 * - active = amountSaved < targetAmount
 * - returns map userId => [ goals... ]
 */
async function findActiveGoalsGroupedByUser() {
  const activeGoals = await Goal.find({ $expr: { $lt: ["$amountSaved", "$targetAmount"] } }).lean();
  const byUser = activeGoals.reduce((acc, g) => {
    acc[g.userId] = acc[g.userId] || [];
    acc[g.userId].push({
      id: g._id,
      title: g.title,
      targetAmount: g.targetAmount,
      amountSaved: g.amountSaved,
      deadline: g.deadline,
      type: g.type,
      contributions: g.contributions || [],
      progressPercent: ((g.amountSaved || 0) / (g.targetAmount || 1)) * 100
    });
    return acc;
  }, {});
  return byUser;
}

/**
 * sendWeeklyReminders()
 * - composes and sends a mail to each user having active goals
 */
export async function sendWeeklyReminders() {
  try {
    const byUser = await findActiveGoalsGroupedByUser();
    const userIds = Object.keys(byUser);
    if (!userIds.length) {
      console.log("[weeklyReminders] No active goals to notify.");
      return { sent: 0 };
    }

    let sentCount = 0;
    for (const uid of userIds) {
      try {
        // fetch user record (assumes User model has email,name)
        const user = await User.findById(uid).lean();
        if (!user || !user.email) {
          console.warn("[weeklyReminders] skip user", uid, "no email");
          continue;
        }

        // build mail
        const goals = byUser[uid];
        const mail = buildWeeklyGoalEmail({ name: user.name || user.email }, goals);

        await sendEmail(user.email, mail.subject, mail.html);

        sentCount++;
        console.log(`[weeklyReminders] Sent to ${user.email} (${goals.length} goals)`);
      } catch (errUser) {
        console.error("[weeklyReminders] error sending to user", uid, errUser);
      }
    }

    return { sent: sentCount };
  } catch (err) {
    console.error("[weeklyReminders] fatal error", err);
    throw err;
  }
}

/**
 * scheduleWeeklyReminders()
 * - schedule at Thursday 14:00 (2:00 PM) in configured TZ
 * Cron expression explanation: '0 14 * * 4' => minute 0, hour 14, every day-of-month, every month, day-of-week 4 (Thu)
 */
export function scheduleWeeklyReminders() {
  const cronExpr = "0 14 * * 4"; // Thursday 14:00
  console.log(`[weeklyReminders] scheduling weekly job: ${cronExpr} TZ=${TZ}`);
  // run immediately at startup once for sanity? we will not run instantly to avoid spam.
  cron.schedule(cronExpr, async () => {
    console.log("[weeklyReminders] Triggered scheduled job");
    try {
      const result = await sendWeeklyReminders();
      console.log(`[weeklyReminders] Completed. Emails sent: ${result.sent}`);
    } catch (e) {
      console.error("[weeklyReminders] scheduled run error", e);
    }
  }, { timezone: TZ });
}
