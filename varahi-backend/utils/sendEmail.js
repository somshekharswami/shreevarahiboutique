const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    console.log("✉️  sendEmail called:", { to, subject });
      if (process.env.NODE_ENV === "test") {
    console.log(`📧 Email skipped in test mode: ${subject}`);
    return true;
  }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user:  process.env.GMAIL_USER,
        pass:  process.env.GMAIL_APP_PASS, // App password
      },
    });

    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"Varahi Boutique" <shreevarahiboutique@gmail.com>`,
      to,
      subject,
      html: htmlContent,
      attachments: attachments, // ✅ Attach PDF or files
    });

    console.log("📨 Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error:", err);
    throw err;
  }
};

module.exports = sendEmail;
