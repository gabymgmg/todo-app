const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();
router.get('/register', authController.registerView); // handles GET requests
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/register', authController.registerUser);// handles POST requests
router.post('/login', authController.loginUser);
router.post('/refreshToken', authController.refreshToken) // Creates the refresh token when access token caducates.
module.exports = router;