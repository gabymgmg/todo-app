const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');

module.exports = {
    createTask: async (req, res) => {
        try {
            const { title, description, dueDate } = req.body;
            const userId = req.user; // Get user ID from the req since it was populated by the middleware
            const newTask = await db.Task.create({
                title: title,
                description: description,
                dueDate: dueDate,
                UserId: userId
            });
            res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    },
    getTaskList: async (req, res) => {
        try {
            const userId = req.user
            console.log('this is the id received', userId)
            const userTasks = await db.Task.findAll({
                where: { UserId: userId }
            })
            res.status(200).json({ message: 'Here is your list of tasks', list: userTasks});
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    },
    getTask: async (req, res) => {
        try {
            const userId = req.user
            const userTasks = db.Task.findAll({
                where: { UserId: userId }
            })
            res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    },
    modifyTask: (req, res) => {
        res.send('hello modify')

        //res.render('register');
    },

}