const User = require('../models/user');
const Recipe = require('../models/recipe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Prijava admina
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) return res.status(401).json({ message: 'Ne postoji admin s tim korisničkim imenom.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Pogrešna lozinka.' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Uspješna prijava admina.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};

// Dohvat svih korisnika
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").lean();
        const userStats = await Promise.all(users.map(async user => {
            const recipes = await Recipe.find({ author: user._id }).lean();
            const totalLikes = recipes.reduce((sum, r) => sum + (r.likes?.length || 0), 0);
            const totalComments = recipes.reduce((sum, r) => sum + (r.comments?.length || 0), 0);
            return { ...user, recipeCount: recipes.length, totalLikes, totalComments };
        }));
        res.json(userStats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška pri dohvatu korisnika" });
    }
};

// Dohvat top recepata
exports.getTopRecipes = async (req, res) => {
    try {
        const topRecipes = await Recipe.find().populate("author", "username").lean();
        topRecipes.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        res.json(topRecipes.slice(0, 5));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška pri dohvatu recepata" });
    }
};

// Dohvat korisnika po usernameu
exports.getUserProfileByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password').lean();
        if (!user) return res.status(404).json({ message: 'Korisnik nije pronađen' });

        const recipes = await Recipe.find({ author: user._id }).lean();
        res.json({ ...user, recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška na serveru" });
    }
};

// Brisanje recepta
exports.adminDeleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const recipe = await Recipe.findByIdAndDelete(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recept nije pronađen" });
        res.json({ message: "Recept je obrisan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška pri brisanju recepta" });
    }
};

// Brisanje komentara
exports.adminDeleteComment = async (req, res) => {
    try {
        const { recipeId, commentId } = req.params;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recept nije pronađen" });

        const index = recipe.comments.findIndex(c => c._id.toString() === commentId);
        if (index === -1) return res.status(404).json({ message: "Komentar nije pronađen" });

        recipe.comments.splice(index, 1);
        await recipe.save();
        res.json({ message: "Komentar je obrisan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška pri brisanju komentara" });
    }
};
