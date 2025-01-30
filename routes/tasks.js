const express = require('express');
const taskController = require('../controllers/tasks');
const validateAccessToken = require('../middlewares/auth')

const router = express.Router();
router.post('/tasks', validateAccessToken, taskController.createTask); // Create Task
router.get('/tasks', validateAccessToken, taskController.getAllTasks);// Return all tasks by userId
router.get('/tasks/:taskId', validateAccessToken, taskController.getTaskById);// Return one task
router.put('/tasks/:taskId', validateAccessToken, taskController.modifyTask); // Modify a task
router.delete('/tasks/:taskId',validateAccessToken, taskController.deleteTaskById); // 

module.exports = router;    