const Recipe = require("../models/recipe.js");
const multer = require('multer');
const path = require('path');

// Dodavanje recepta
const addRecipe = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Naslov i opis su obavezni." });
        }

        // Koristi file ili link slike
        if (!req.file && !imageUrl) {
            return res.status(400).json({ message: "Slika je obavezna." });
        }
        const image = req.file ? "/upload/" + req.file.filename : imageUrl;
        const author = req.user.id;

        const newRecipe = new Recipe({
            title,
            description,
            image,
            author,
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error("Greška u addRecipe:", error);
        res.status(500).json({ message: "Greška pri dodavanju recepta." });
    }
};

// Un/Lajkanje recepta
const toggleLikeRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recept nije pronađen." });

        const userId = req.user.id;
        const index = recipe.likes.indexOf(userId);

        if (index === -1) {
            recipe.likes.push(userId);
        } else {
            recipe.likes.splice(index, 1);
        }

        await recipe.save();
        res.json({ likesCount: recipe.likes.length });
    } catch (error) {
        console.error("Greška u toggleLikeRecipe:", error);
        res.status(500).json({ message: "Greška pri lajkanju recepta." });
    }
};

// Pisanje komentara za recept
const addComment = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recept nije pronađen." });

        const userId = req.user.id;
        const text = req.body.text;

        if (!text) {
            return res.status(400).json({ message: "Komentar ne smije biti prazan." });
        }

        const comment = {
            user: userId,
            text,
            createdAt: new Date(),
        };

        recipe.comments.push(comment);
        await recipe.save();

        const savedComment = await recipe.populate('comments.user', 'username');
        const newComment = savedComment.comments[savedComment.comments.length - 1];

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Greška u addComment:", error);
        res.status(500).json({ message: "Greška pri dodavanju komentara." });
    }
};

// Dohvati sve recepte
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate("author", "username")
            .populate("comments.user", "username")
            .sort({ createdAt: -1 })
            .lean();

        if (req.user && req.user.role !== 'guest' && req.user.id) {
            const userId = req.user.id.toString();
            const recipesWithLikes = recipes.map(recipe => ({
                ...recipe,
                hasLiked: Array.isArray(recipe.likes) && recipe.likes.some(
                    likeUserId => likeUserId != null && likeUserId.toString() === userId
                )
            }));

            return res.json(recipesWithLikes);
        }

        return res.json(recipes);
    } catch (error) {
        console.error("Greška u getAllRecipes:", error);
        res.status(500).json({ message: "Greška pri dohvaćanju recepata." });
    }
};

// Dohvati recepte prijavljenog korisnika
const getUserRecipes = async (req, res) => {
    try {
        const userId = req.user.id;

        const recipes = await Recipe.find({ author: userId })
            .populate("author", "username")
            .populate("comments.user", "username")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(recipes);
    } catch (error) {
        console.error("Greška u getUserRecipes:", error);
        res.status(500).json({ message: "Greška pri dohvaćanju korisničkih recepata." });
    }
};

// Brisanje recepta
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recept nije pronađen." });
        }

        if (recipe.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Nemate dozvolu za brisanje ovog recepta." });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Recept je uspješno obrisan." });
    } catch (error) {
        console.error('Greška pri brisanju:', error);
        res.status(500).json({ message: "Greška pri brisanju recepta." });
    }
};
// Gdje će se spremati slike
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = {
    addRecipe,
    toggleLikeRecipe,
    addComment,
    getAllRecipes,
    getUserRecipes,
    deleteRecipe,
    upload
};
