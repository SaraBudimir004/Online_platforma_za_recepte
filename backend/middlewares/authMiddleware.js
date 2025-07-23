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

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Korisnik nije pronađen." });
            }

            return next();
        }

        return res.status(401).json({ message: "Nema tokena" });
    } catch (error) {
        return res.status(401).json({ message: "Nije autoriziran" });
    }
};

