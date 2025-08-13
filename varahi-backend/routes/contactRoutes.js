// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const adminEmail = process.env.GMAIL_USER; // Your receiving email

  try {
    // 1. Send to Admin
    const adminHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    await sendEmail(adminEmail, `📬 New Message: ${subject}`, adminHtml);

    // 2. Auto-reply to User
    const userHtml = `
      <h2>Hello ${name},</h2>
      <p>Thank you for contacting Varahi Boutique.</p>
      <p>We have received your message and will respond shortly.</p>
      <p>Regards,<br/>Varahi Boutique Team</p>
    `;

    await sendEmail(email, "✅ We've received your message", userHtml);

    res.status(200).json({ success: true, message: "Contact form submitted." });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
