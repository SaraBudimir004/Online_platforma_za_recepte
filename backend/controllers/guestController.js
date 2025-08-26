const jwt = require('jsonwebtoken');

// Gost se prijavljuje bez lozinke - samo dobije token s rolom 'guest'
exports.guestLogin = (req, res) => {
    const token = jwt.sign(
        { role: 'guest' },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    );

    res.json({ token, message: 'Gost je prijavljen.' });
};
