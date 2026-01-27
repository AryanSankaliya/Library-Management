const express = require("express");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const User = require("../models/User");
const transporter = require("../config/mailer");
const logActivity = require("../utils/activityLogger");

const router = express.Router();

/* SEND OTP */
router.post("/send-otp", async (req, res) => {
  try {
    let { email } = req.body;


    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }
    email = email.trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    const info = await transporter.sendMail({
      to: email,
      subject: "Library Management System - OTP Verification",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Library Management System</h2>

      <p>Hello,</p>

      <p>
        Thank you for using our <b>Library Management System</b>.
        To verify your request, please use the OTP below:
      </p>

      <p style="font-size: 20px; font-weight: bold; letter-spacing: 2px;">
        ${otp}
      </p>

      <p>This OTP is valid for <b>5 minutes</b> only.</p>

      <p style="color: #555;">
        Please do not share this code with anyone for security reasons.
      </p>

      <p>
        If you did not request this OTP, you can safely ignore this email.
      </p>

      <br />
      <p>Best regards,<br />
      <b>Team Library Management System</b></p>
    </div>
  `
    });


    // Log Activity
    await logActivity(email, 'FORGOT_PASS', 'Requested password reset OTP');

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* VERIFY OTP */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = await Otp.findOne({ email });
    if (!otpData)
      return res.status(400).json({ success: false, message: "OTP not found" });

    if (Date.now() > otpData.expiresAt) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpData.otp);
    if (!isValid)
      return res.status(401).json({ success: false, message: "Invalid OTP" });

    await Otp.deleteOne({ email });

    res.json({ success: true, message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* RESET PASSWORD */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password required" });
    }

    const otpData = await Otp.findOne({ email });
    if (!otpData)
      return res.status(400).json({ success: false, message: "OTP not found or expired" });

    if (Date.now() > otpData.expiresAt) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpData.otp);
    if (!isValid)
      return res.status(401).json({ success: false, message: "Invalid OTP" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete OTP
    await Otp.deleteOne({ email });

    res.json({ success: true, message: "Password reset successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
