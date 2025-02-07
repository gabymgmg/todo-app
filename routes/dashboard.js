const express = require('express');
const dashboardController = require('../controllers/dashboard');
//const validateAccessToken = require('../middlewares/auth')
const passport = require('passport')
const router = express.Router();

router.get('/dashboard', passport.authenticate('jwt', { session: false , failureRedirect: '/login'}), dashboardController.dashboardView);

module.exports = router;