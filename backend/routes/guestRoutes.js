const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

router.post('/login', guestController.guestLogin);

module.exports = router;
