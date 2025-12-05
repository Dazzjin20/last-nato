const { ApplicationRepository } = require('../repositories/applicationRepository');
const applicationRepository = new ApplicationRepository();

const createApplication = async (req, res) => {
    try {
        const { pet, adopter, message } = req.body;

        if (!pet || !adopter) {
            return res.status(400).json({ message: 'Pet ID and Adopter ID are required.' });
        }

        const newApplication = await applicationRepository.submit({ pet, adopter, message });
        res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: error.message || 'Internal server error.' });
    }
};

const getApplicationsForAdopter = async (req, res) => {
    try {
        const { adopterId } = req.params;
        if (!adopterId) {
            return res.status(400).json({ message: 'Adopter ID is required.' });
        }
        const applications = await applicationRepository.findAllForAdopter(adopterId);
        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error fetching applications for adopter:', error);
        res.status(500).json({ message: error.message || 'Internal server error.' });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const application = await applicationRepository.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json({ application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get application', error: err.message });
    }
};

module.exports = {
    createApplication,
    getApplicationsForAdopter,
    getApplicationById,
};