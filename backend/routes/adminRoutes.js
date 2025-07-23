const express = require('express');
const router = express.Router();
const authController = require('../controllers/adminController');

router.post('/admin-login', authController.adminLogin);

module.exports = router;
