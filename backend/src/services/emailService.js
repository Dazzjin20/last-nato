const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Gumawa ng transporter object gamit ang SMTP transport.
        // Gumagamit tayo ng environment variables para manatiling secure ang credentials.
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true para sa port 465, false para sa ibang ports tulad ng 587
            auth: {
                user: process.env.EMAIL_USER, // Ang iyong Gmail address
                pass: process.env.EMAIL_PASS, // Ang iyong Gmail App Password
            },
        });
    }

    async sendPasswordResetEmail(userEmail, resetToken) {
        const resetUrl = `http://localhost:5500/frontend/pages/reset-password.html?token=${resetToken}`;

        const mailOptions = {
            from: `"Pet Adoption Platform" <${process.env.EMAIL_USER}>`, // sender address
            to: userEmail, // list of receivers
            subject: 'Your Password Reset Link', // Subject line
            text: `Hello, \n\nPlease click the link below to reset your password. This link is valid for 10 minutes.\n\n${resetUrl}`, // plain text body
            html: `
                <p>Hello,</p>
                <p>Please click the link below to reset your password. This link is valid for 10 minutes.</p>
                <a href="${resetUrl}" style="background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            `, // html body
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send password reset email.');
        }
    }
}

module.exports = new EmailService();