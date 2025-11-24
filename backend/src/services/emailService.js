// In a real application, you would use a library like Nodemailer
// and an email service provider (e.g., SendGrid, Mailgun).

class EmailService {
    async sendPasswordResetEmail(userEmail, resetToken) {
        const resetUrl = `http://localhost:5500/frontend/pages/reset-password.html?token=${resetToken}`;

        console.log('--- PASSWORD RESET EMAIL ---');
        console.log(`To: ${userEmail}`);
        console.log('Subject: Your Password Reset Link');
        console.log('Body: Please click the link below to reset your password.');
        console.log(`Link: ${resetUrl}`);
        console.log('--- END OF EMAIL ---');
        // In a real app, this would return a promise from your email sending library.
        return Promise.resolve();
    }
}

module.exports = new EmailService();