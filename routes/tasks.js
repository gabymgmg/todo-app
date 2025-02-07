const express = require('express');
const taskController = require('../controllers/tasks');
const passport = require('passport');

const router = express.Router();
router.post('/tasks', passport.authenticate('jwt', { session: false }), taskController.createTask); // Create Task
router.get('/tasks', passport.authenticate('jwt', { session: false }), taskController.getAllTasks);// Return all tasks by userId
router.get('/tasks/:taskId', passport.authenticate('jwt', { session: false }), taskController.getTaskById);// Return one task
router.put('/tasks/:taskId', passport.authenticate('jwt', { session: false }), taskController.modifyTask); // Modify a task
router.delete('/tasks/:taskId',passport.authenticate('jwt', { session: false }), taskController.deleteTaskById); // 

module.exports = router;    