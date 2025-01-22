const express = require('express');
const taskController = require('../controllers/tasks');
const validateRequest = require('../middlewares/auth')

const router = express.Router();
router.post('/createTask', validateRequest, taskController.createTask); // 
router.get('/getTask', taskController.getTask);// handles GET requests
router.post('/modifyTask', taskController.modifyTask); // 


module.exports = router;