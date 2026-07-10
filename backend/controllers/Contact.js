const mailSender = require("../utils/mailSender");

// ─────────────────────────────────────────────────
// Contact Us – Send email to admin
// ─────────────────────────────────────────────────
exports.contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, message, countryCode } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "First name, email, and message are required",
      });
    }

    const fullName = `${firstName} ${lastName || ""}`.trim();

    // Email to admin
    const adminEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">New Contact Request – StudyNotion</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${fullName}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${countryCode || ""} ${phoneNo || "Not provided"}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px;">${message}</td></tr>
        </table>
      </div>
    `;

    // Confirmation email to user
    const userEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">Thank you for reaching out, ${firstName}!</h2>
        <p>We have received your message and our team will get back to you within 24–48 hours.</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; margin-top: 16px;">
          <p style="margin: 0; color: #64748b;"><strong>Your message:</strong><br>${message}</p>
        </div>
        <p style="margin-top: 24px; color: #64748b;">Best regards,<br><strong>The StudyNotion Team</strong></p>
      </div>
    `;

    // Send to admin (use MAIL_USER as admin email, or a dedicated ADMIN_EMAIL)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    if (adminEmail) {
      await mailSender(adminEmail, "New Contact Form Submission – StudyNotion", adminEmailBody);
    }

    // Send confirmation to user
    await mailSender(email, "We received your message – StudyNotion", userEmailBody);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    console.error("Error in contactUs:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending contact message",
    });
  }
};
