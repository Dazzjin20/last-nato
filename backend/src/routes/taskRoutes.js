const express = require('express');
const router = express.Router();
const { createTask, getTasks, assignTask } = require('../controller/taskController');

// Handles requests to /api/tasks
router.route('/').post(createTask).get(getTasks);

// Handles assigning a volunteer to a task
router.route('/:id/assign').put(assignTask);

module.exports = router;