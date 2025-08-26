const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipe');

// Registracija korisnika
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email je obavezan.' });
    }

    // Email završava na gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email mora biti valjan i završavati na gmail.com' });
    }

    try {
        // Provjeri postoji li korisnik s istim usernameom ili emailom
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Korisničko ime ili email već postoji.' });
        }

        const newUser = new User({ username, email, password, role: 'user' });
        await newUser.save();

        res.status(201).json({ message: 'Registracija uspješna.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};

// Prijava korisnika
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, role: 'user' });
        if (!user) {
            return res.status(401).json({ message: 'Korisnik nije pronađen.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Pogrešna lozinka.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Prijava uspješna.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password').lean();
        if (!user) return res.status(404).json({ message: 'Korisnik nije pronađen' });

        const recipes = await Recipe.find({ author: user._id }).lean();
        res.json({ ...user, recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};


