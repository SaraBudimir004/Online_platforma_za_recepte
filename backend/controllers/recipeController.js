import Recipe from "../models/recipe.js";

// Dodavanje recepta
export const addRecipe = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Naslov i opis su obavezni." });
        }

        // Ako postoji fajl, koristi ga, inače koristi link slike ako je poslan
        const image = req.file ? "/uploads/" + req.file.filename : imageUrl || null;

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

// Lajkanje ili un-lajkanje recepta
export const toggleLikeRecipe = async (req, res) => {
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

// Dodavanje komentara na recept
export const addComment = async (req, res) => {
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

        res.status(201).json(comment);
    } catch (error) {
        console.error("Greška u addComment:", error);
        res.status(500).json({ message: "Greška pri dodavanju komentara." });
    }
};

// Dohvati sve recepte
export const getAllRecipes = async (req, res) => {
    try {
        console.log('req.user:', req.user); // Dodaj ovo da vidiš je li req.user definiran
        const userId = req.user.id; // Ovo baca grešku ako req.user nije postavljen

        const recipes = await Recipe.find()
            .populate("author", "username")
            .populate("comments.user", "username")
            .sort({ createdAt: -1 })
            .lean();

        const recipesWithLikes = recipes.map(recipe => ({
            ...recipe,
            hasLiked: recipe.likes.some(likeUserId => likeUserId.toString() === userId)
        }));

        res.json(recipesWithLikes);
    } catch (error) {
        console.error("Greška u getAllRecipes:", error);
        res.status(500).json({ message: "Greška pri dohvaćanju recepata." });
    }
};

