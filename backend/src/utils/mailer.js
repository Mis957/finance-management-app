// src/utils/mailer.js
import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const buildWeeklyGoalEmail = (user, goals) => {
  const goalList = goals.map(g => `
    <li style="margin-bottom: 8px;">
      <strong>${g.title}</strong> — ${g.progressPercent.toFixed(1)}% complete
      <br/>Saved ₹${g.amountSaved} of ₹${g.targetAmount}
    </li>
  `).join("");

  return {
    subject: `Weekly Goal Update – Keep Going ${user.name}!`,
    html: `
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:20px;font-family:Arial, sans-serif;color:#333;">
      
      <!-- HEADER -->
      <div style="text-align:center;padding-bottom:10px;border-bottom:2px solid #eee;">
        <img src="https://i.ibb.co/D7hVJ0h/wallet-blue-logo.png" width="70" style="margin-bottom:8px"/>
        <h2 style="margin:0;color:#007bff;">PocketHeist</h2>
        <p style="margin:0;color:#555;font-size:14px;">Smart Finance. Simple Life.</p>
      </div>

      <!-- BODY -->
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Here is your <strong>weekly savings reminder</strong>! You're making progress – stay consistent 💪</p>

      <ul>${goalList}</ul>

      <p style="margin-top:10px;">Stay disciplined and you'll reach your goals in no time 🚀</p>

      <!-- BUTTON -->
      <div style="text-align:center;margin:25px 0;">
        <a href="http://localhost:3000/goals" 
          style="background:#007bff;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;">
          View My Goals
        </a>
      </div>

      <!-- FOOTER -->
      <hr/>
      <p style="font-size:12px;color:#888;text-align:center;">
        You are receiving this mail because you created an account at <b>PocketHeist</b>.
      </p>
    </div>
  `};
};
