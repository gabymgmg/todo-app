const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); 


module.exports = {
    createTask: async (req, res) => {
        try {
            const { title, description, dueDate, status } = req.body;
            const userId = req.user.id; // Get user ID from the req since it was populated by the middleware
            const newTask = await db.Task.create({
                title: title,
                description: description,
                dueDate: dueDate,
                status: status,
                UserId: userId
            });
            res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    },
    getAllTasks: async (req, res) => {
        try {
            const userId = req.user
            const userTasks = await db.Task.findAll({
                where: { UserId: userId }
            })
            if (userTasks) res.status(200).json({ message: 'Tasks returned successfully', tasks: userTasks });
            else res.status(400).json({ message: 'Task not found' });
        } catch (error) {
            console.error('Error returning task:', error);
            res.status(500).json({ error: 'Failed getting tasks' });
        }
    },
    getTaskById: async (req, res) => {
        try {
            const taskId = req.params.taskId
            const task = await db.Task.findByPk(taskId)
            // Check if task exist
            if (task) res.status(200).json({ message: 'Task returned successfully', task: task });
            else res.status(404).json({ message: 'Task not found' });
        } catch (error) {
            console.error('Error getting the task:', error);
            res.status(500).json({ error: 'Failed getting task' });
        }
    },
    modifyTask: async (req, res) => {
        try {
            const taskId = req.params.taskId
            const { title, description, dueDate, status } = req.body
            const task = await db.Task.findByPk(taskId)
            // Check if task exist
            if (!task) return res.status(404).json({ message: 'Task not found' });
            await task.update({ title: title, description: description, dueDate: dueDate, status: status });
            res.status(200).json({ message: 'Task updated successfully', task: task });
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ error: 'Failed modifying the task' });
        }
    },
    deleteTaskById: async (req, res) => {
        try {
            const taskId = req.params.taskId
            // Check if task exist
            const task = await db.Task.findByPk(taskId)
            if (!task) return res.status(404).json({ message: 'Task not found' });
            await task.destroy({ id : taskId});
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Failed deleting the task' });
        }
    },


}