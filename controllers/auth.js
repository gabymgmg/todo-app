const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const configDev = config.development

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
      // Generate Access Token (short-lived)
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION, // e.g., '15m', '1h'
      });

      // Generate Refresh Token (long-lived)
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION, // e.g., '7d', '30d'
      });
      // Set the refresh token(long-lived) in cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // flag to prevent JavaScript from reading it.
        secure: configDev.cookie.secure, // Set to true in production 
        maxAge: configDev.cookie.maxAge, // Matches refresh token expiration
        sameSite: 'strict' // Important to prevent CSRF attacks
      });
      // Send Access Token to Client
      res.status(200).json({ accessToken }); // Send only the access token
    } catch (error) {
      console.log(error)
      return res.status(500).send('Sign in error');
    }
  },

  logoutUser: (req, res) => {
    res.redirect('login');
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
