const ActivityLog = require('../models/activityLogModel');

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, type, category, priority, estimatedHours, points, dueDate, location } = req.body;
    
    const newTask = new ActivityLog({
        title,
        description,
        type,
        category,
        priority,
        estimatedHours,
        points,
        dueDate: new Date(dueDate), // Ensure it's a Date object
        location
    });

    const createdTask = await newTask.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await ActivityLog.find({}).populate('assignedTo', 'name').sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// @desc    Assign a volunteer to a task
// @route   PUT /api/tasks/:id/assign
const assignTask = async (req, res) => {
    try {
        const { volunteerId } = req.body;
        const { id: taskId } = req.params;

        if (!volunteerId) {
            return res.status(400).json({ message: 'Volunteer ID is required.' });
        }

        const updatedTask = await ActivityLog.findByIdAndUpdate(
            taskId,
            { assignedTo: volunteerId, status: 'Assigned' },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name'); // Populate the volunteer's name

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning task', error: error.message });
    }
};

module.exports = { createTask, getTasks, assignTask };