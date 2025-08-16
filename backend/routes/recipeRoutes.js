const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const {
    addRecipe,
    toggleLikeRecipe,
    addComment,
    getAllRecipes,
    getUserRecipes,
    deleteRecipe,
    getRecipesByUserId
} = require('../controllers/recipeController');

const router = express.Router();

// Multer storage za slike
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'upload/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Rute
router.get('/', protect, getAllRecipes);
router.post('/', protect, upload.single('image'), addRecipe);
router.post('/:id/like', protect, toggleLikeRecipe);
router.post('/:id/comment', protect, addComment);
router.get('/my-recipes', protect, getUserRecipes);
router.get('/user/:userId', getRecipesByUserId);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
