const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const configDev = config.development
const passport = require('passport')

module.exports = {
  dashboardView: (req, res) => {
    if (req.user) { 
      res.render('dashboard', { name: req.user.name }); 
    } else {
      res.render('login')
    }
  }
}