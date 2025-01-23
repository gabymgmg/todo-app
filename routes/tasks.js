const express = require('express');
const taskController = require('../controllers/tasks');
const validateRequest = require('../middlewares/auth')

const router = express.Router();
router.post('/tasks', validateRequest, taskController.createTask); // Create Task
router.get('/tasks', validateRequest, taskController.getAllTasks);// Return all tasks by userId
router.get('/tasks/:taskId', validateRequest, taskController.getTaskById);// Return one task
router.put('/task/:taskId', validateRequest, taskController.modifyTask); // Modify a task
router.delete('/tasks:taskId',validateRequest, taskController.deleteTask); // 

module.exports = router;    