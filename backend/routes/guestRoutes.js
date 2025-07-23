const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// Ruta za guest login bez lozinke
router.post('/login', guestController.guestLogin);

module.exports = router;
