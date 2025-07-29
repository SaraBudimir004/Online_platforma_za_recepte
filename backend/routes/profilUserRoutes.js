const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profilUserController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserProfile);
router.post('/', protect, updateUserProfile);

module.exports = router;
