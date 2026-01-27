const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Env se email uthayega
        pass: process.env.EMAIL_PASS  // Env se App Password uthayega
    },
    // RENDER FIX: Force IPv4 (Bohot zaruri hai)
    family: 4, 
    connectionTimeout: 10000,
    tls: {
        rejectUnauthorized: false
    }
});


module.exports = transporter;