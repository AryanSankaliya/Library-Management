const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const nodemailer = require('nodemailer');

async function sendTestEmail() {
    console.log("Starting email test...");
    console.log("Env path:", path.join(__dirname, '../.env'));
    console.log("User:", process.env.EMAIL_USER);
    // Don't log password for security, just length
    console.log("Password length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing email credentials in .env file!");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from Script",
            text: "If you receive this, email sending is working!"
        });
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

sendTestEmail();
