const adopterRepository = require('../repositories/adopterRepository');

const adopterController = {};

/**
 * Updates an adopter's profile information.
 */
adopterController.updateProfile = async (req, res) => {
    try {
        const { adopterId } = req.params;
        const updateData = req.body;

        // Ensure the user is not trying to change their role
        if (updateData.role) {
            delete updateData.role;
        }

        const updatedAdopter = await adopterRepository.updateById(adopterId, updateData);

        if (!updatedAdopter) {
            return res.status(404).json({ message: 'Adopter not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully!', user: updatedAdopter });
    } catch (error) {
        console.error('Error updating adopter profile:', error);
        res.status(500).json({ message: 'Failed to update profile.', error: error.message });
    }
};

module.exports = adopterController;