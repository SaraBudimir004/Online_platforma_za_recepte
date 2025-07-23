const jwt = require('jsonwebtoken');

// Gost se prijavljuje bez lozinke - samo dobije token s rolom 'guest'
exports.guestLogin = (req, res) => {
    // Kreiraj JWT token za gosta koji traje npr. 3 dana
    const token = jwt.sign(
        { role: 'guest' },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    );

    res.json({ token, message: 'Gost je prijavljen.' });
};
