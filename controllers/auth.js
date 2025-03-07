const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const configDev = config.development
const passport = require('passport')
const messages = require('../utils/messajes.js')
let db;
if (process.env.NODE_ENV === 'test') {
  db = require('../models/index.mock');
} else {
  db = require('./models/index');
}

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
        return res.render('register', { error: messages.PLEASE_FILL_ALL_FIELDS });
      }
      // check if user exists
      if (await db.User.findOne({ where: { email } })) {
        return res.render('register', { error: messages.USER_ALREADY_EXISTS});
      }
      // create the user
      await db.User.create({ name, email, password: bcrypt.hashSync(password, 8) });
      // redirect to login page
      return res.status(200).redirect('login?registrationdone')

    }
    catch (error) {
      console.log(error)
      return res.status(500).send(messages.REGISTRATION_ERROR);
    }
  },

  loginUser: (req, res) => {
    passport.authenticate('local', { failureRedirect: '/login' }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: messages.AUTHENTICATION_ERROR });
      }
      if (!user) {
        return res.status(401).json({ message: messages.INVALID_CREDENTIALS});
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
      res.cookie('refreshToken', refreshToken, { httpOnly: true }); // Send the refresh token as a cookie
      res.json({ message: messages.LOGIN_SUCCESS});
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
