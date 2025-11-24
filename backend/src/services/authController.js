const crypto = require('crypto');
const adopterRepository = require('../repositories/adopterRepository');
const volunteerRepository = require('../repositories/volunteerRepository');
const staffRepository = require('../repositories/staffRepository');
const emailService = require('../services/emailService');

// Helper to find user across all repositories
const findUserByEmail = async (email) => {
    const repositories = [adopterRepository, volunteerRepository, staffRepository];
    for (const repo of repositories) {
        const user = await repo.findByEmail(email);
        if (user) return { user, repo };
    }
    return { user: null, repo: null };
};

async function handleRegistration(req, res, repository) {
    try {
        const { email } = req.body;
        const existingUser = await repository.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered.' });
        }
        const user = await repository.create(req.body);
        user.password = undefined; // Do not send password back
        return res.status(201).json({ message: 'Registration successful!', user });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'An error occurred during registration.', error: err.message });
    }
}

async function handleForgotPassword(req, res) {
    try {
        const { email } = req.body;
        const { user, repo } = await findUserByEmail(email);

        if (!user) {
            // We send a generic success message to prevent email enumeration attacks
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Generate a token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.password_reset_expires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Send the email
        await emailService.sendPasswordResetEmail(user.email, resetToken);

        return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({ message: 'An internal error occurred.' });
    }
}

async function handleResetPassword(req, res) {
    try {
        const { token, password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by token
        const repositories = [adopterRepository, volunteerRepository, staffRepository];
        let user = null;
        for (const repo of repositories) {
            // Note: This requires a new method in your repositories
            // e.g., user = await repo.findOne({ password_reset_token: hashedToken, password_reset_expires: { $gt: Date.now() } });
            // Since I cannot add it, I'll simulate it.
            // In a real scenario, you'd implement `findByResetToken` in each repository.
        }

        // This is a placeholder. You need to implement the actual database query.
        // For now, let's assume we can't find the user this way and need to iterate.
        // This is inefficient and for demonstration only.
        const allUsers = [
            ...(await adopterRepository.findAll()), 
            ...(await volunteerRepository.findAll()), 
            ...(await staffRepository.findAll())
        ];
        user = allUsers.find(u => u.password_reset_token === hashedToken && u.password_reset_expires > Date.now());

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Set new password
        user.password = password; // The hashing will happen in the pre-save hook or repo
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;
        await user.save(); // This should trigger the bcrypt hashing

        return res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ message: 'An internal error occurred.' });
    }
}

module.exports = {
    handleRegistration,
    handleForgotPassword,
    handleResetPassword
};