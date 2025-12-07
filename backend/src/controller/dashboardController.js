const { ApplicationRepository } = require('../repositories/applicationRepository');
const mongoose = require('mongoose');

const applicationRepository = new ApplicationRepository();

/**
 * Gathers and returns statistics for the adopter dashboard.
 */
exports.getAdopterDashboardStats = async (req, res) => {
    try {
        const { adopterId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(adopterId)) {
            return res.status(400).json({ message: 'Invalid Adopter ID.' });
        }

        // Use the existing repository to find all applications for the adopter
        const applications = await applicationRepository.findAllForAdopter(adopterId);

        const stats = {
            totalApplications: applications.length,
            approved: 0,
            adopted: 0,
        };

        // Calculate counts from the fetched applications
        applications.forEach(app => {
            if (app.status === 'Approved') {
                stats.approved++;
            }
            if (app.status === 'Adopted') {
                stats.adopted++;
            }
        });

        // For the activity feed, we can send the 5 most recent applications
        const recentActivities = applications
            .slice(0, 5) // Get the 5 most recent since the query is already sorted
            .map(app => ({
                action: `Applied for ${app.pet_name}`,
                status: app.status,
                timestamp: app.date_submitted,
            }));

        res.status(200).json({ stats, recentActivities });

    } catch (error) {
        console.error('Error fetching adopter dashboard stats:', error);
        res.status(500).json({ message: 'Failed to get dashboard stats.', error: error.message });
    }
};