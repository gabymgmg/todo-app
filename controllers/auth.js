const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
  registerView: (req, res) => {
    res.render('register');
  },

  loginView: (req, res) => {
    res.render('login');
  },

  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render('register', { error: 'Please fill all fields' });
    }
    // check if user exists
    if (await User.findOne({ where: { email } })) {
      return res.render('register', { error: 'A user account already exists with this email' });
    }
    // create the user
    await User.create({ name, email, password: bcrypt.hashSync(password, 8) });

    res.redirect('login?registrationdone');
  },

  loginUser: (req, res) => {
    res.redirect('dashboard');
  },

  logoutUser: (req, res) => {
    res.redirect('login');
  }
}