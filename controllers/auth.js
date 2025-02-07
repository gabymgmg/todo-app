const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const configDev = config.development
const passport = require('passport')
module.exports = {
  registerView: (req, res) => {
    res.render('register');
  },

  loginView: async (req, res) => {
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

  loginUser: (req, res) => {
    passport.authenticate('local', { failureRedirect: '/login' }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication Error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
      // Generate Access Token (short-lived)
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      // Generate Refresh Token (long-lived)
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });
      // Respond with token
      res.cookie('jwt', accessToken, { httpOnly: true }); // Set JWT as an HTTP-only cookie
      res.json({ message: 'Login Successful' });
    })(req, res);
  },

  logoutUser: (req, res) => {
    if (req.cookies.jwt) { 
      res.clearCookie('jwt'); 
    }
    res.status(200).redirect('/login'); 
  },

  refreshToken: (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }
    // Generate a new JWT token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => { // Use refresh token secret
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, { // Use access token secret
        expiresIn: process.env.JWT_ACCESS_EXPIRATION, // Short-lived
      });

      res.status(200).json({ accessToken: newAccessToken }); // Send the new access token
    })
  }
}
