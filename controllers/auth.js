const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');

module.exports = {
  registerView: (req, res) => {
    res.render('register');
  },

  loginView: (req, res) => {
    res.render('login');
  },
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.render('register', { error: 'Please fill all fields' });
      }
      // check if user exists
      if (await db.User.findOne({ where: { email } })) {
        return res.render('register', { error: 'A user account already exists with this email' });
      }
      // create the user
      await db.User.create({ name, email, password: bcrypt.hashSync(password, 8) });
      // redirect to login page
      return res.status(200).redirect('login?registrationdone')

    }
    catch (error) {
      console.log(error)
      return res.status(500).send('Error in registering user');
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.User.findOne({
        where: { email }
      });
      if (!user) {
        return res.status(404).json('Email not found');
      }
      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(404).json('Incorrect email and password combination');
      }
      // Authenticate user with jwt
      const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION
      });

      res.status(200).send({
        id: user.userId,
        name: user.name,
        email: user.email,
        accessToken: token,
      });
    } catch (err) {
      return res.status(500).send('Sign in error');
    }
  },

  logoutUser: (req, res) => {
    res.redirect('login');
  }
}
