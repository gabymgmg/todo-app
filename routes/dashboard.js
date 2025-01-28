const express = require('express');
const dashboardController = require('../controllers/dashboard');
const validateRequest = require('../middlewares/auth')

const router = express.Router();
router.get('/dashboard', dashboardController.dashboardView);

module.exports = router;