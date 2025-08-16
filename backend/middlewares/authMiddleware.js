const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware za provjeru prijave
const protect = async (req, res, next) => {
    let token;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ako je gost
            if (decoded.role === "guest") {
                req.user = { role: "guest", id: null };
                return next();
            }

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "Korisnik nije pronađen." });
            }

            req.user =  { id: user.id, role: user.role };
            next();
        } else {
            return res.status(401).json({ message: "Token nije pronađen." });
        }
    } catch (error) {
        return res.status(401).json({ message: "Nevažeći token." });
    }
};

// Middleware za admina
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Samo admin može pristupiti.' });
    }
    next();
};

module.exports = { protect, adminOnly };
