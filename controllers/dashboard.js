const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const configDev = config.development
const passport = require('passport')

module.exports = {
  dashboardView: async (req, res) => {
    if (req.user) {
      try {
        const tasks = await db.Task.findAll({ 
          where: { UserId: req.user.id } 
        }); 
        res.render('dashboard', { name: req.user.name ,tasks: tasks });
      }
      catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Error fetching tasks.');
      }
    }
  }
}