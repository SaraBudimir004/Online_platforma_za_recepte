const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// Prikaz korisničkog profila
router.get('/:userId', protect, userController.getUserById);


module.exports = router;
