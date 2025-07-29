import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "Korisnik nije pronađen." });
            }

            if (user.role === "guest") {
                return res.status(403).json({ message: "Gost nema pristup ovoj ruti." });
            }

            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: "Token nije pronađen." });
        }
    } catch (error) {
        return res.status(401).json({ message: "Nevažeći token." });
    }
};
