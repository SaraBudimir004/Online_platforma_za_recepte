const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const userController = require('../controllers/userControllers');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Admin login
router.post('/admin-login', adminController.adminLogin);

// Dohvat svih korisnika
router.get('/users', protect, adminOnly, adminController.getAllUsers);

// Dohvat top recepata
router.get('/recipes/top-liked', protect, adminOnly, adminController.getTopRecipes);

// Dohvat korisnika po usernameu
router.get('/users/username/:username', protect, adminOnly, adminController.getUserProfileByUsername);

// Dohvat korisnika po ID-u
router.get('/users/:userId', protect, adminOnly, userController.getUserById);

// Brisanje recepta
router.delete('/recipe/:recipeId', protect, adminOnly, adminController.adminDeleteRecipe);

// Brisanje komentara
router.delete('/recipe/:recipeId/comment/:commentId', protect, adminOnly, adminController.adminDeleteComment);

module.exports = router;
