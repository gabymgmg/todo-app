const express = require('express');
const dashboardController = require('../controllers/dashboard');
const validateAccessToken = require('../middlewares/auth')
const passport = require('../passport')
const router = express.Router();
const { protectRoute } = require('../passport');

router.get('/dashboard',protectRoute, dashboardController.dashboardView);

module.exports = router;