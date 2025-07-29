const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const {
    addRecipe,
    toggleLikeRecipe,
    addComment,
    getAllRecipes,
    getUserRecipes,
    deleteRecipe
} = require('../controllers/recipeController');

const router = express.Router();

// Postavljanje multer storage-a za slike
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Dodavanje recepta (može upload slike ili link slike)
router.post('/add', protect, upload.single('image'), addRecipe);

// Lajkanje recepta
router.post('/:id/like', protect, toggleLikeRecipe);

// Dodavanje komentara
router.post('/:id/comment', protect, addComment);

// Dohvati sve recepte
router.get('/', protect, getAllRecipes);

// Dohvati recepte određenog korisnika
router.get('/my-recipes', protect, getUserRecipes);

//Brisanje recepata
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
