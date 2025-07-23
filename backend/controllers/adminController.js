const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Nađi korisnika s ulogom admin
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) return res.status(401).json({ message: 'Ne postoji admin s tim korisničkim imenom.' });

        // Provjeri lozinku
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Pogrešna lozinka.' });

        // Kreiraj JWT token (vrijedi npr. 1 sat)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Uspješna prijava admina.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};
