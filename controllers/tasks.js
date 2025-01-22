const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');

module.exports = {
    createTask: async (req, res) => {
        try {
            const { title, description, dueDate } = req.body;
            const userId = parseInt(req.user); // Get user ID from the req since it was populated by the middleware
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
    getTask: async (req, res) => {

    },
    modifyTask: (req, res) => {
        res.send('hello modify')

        //res.render('register');
    },

}