const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../connection/sqlConnection");

module.exports = async (req, res, next) => {

    try {
        const token = req.cookies.authToken;
        if (!token) {
            throw new Error("Aucun token fourni. Authentification requise.");
        }

        const decodedToken = jwt.verify(token, process.env._SECRET_KEY);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;

        req.auth = {
            userId: userId,
            isAdmin: isAdmin
        }

        if (req.auth.isAdmin !== 1) throw new Error("Droits insuffisants. Accès réservé aux administrateurs.");

        next();

    } catch (err) {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });

        res.status(401).json({ msg: "Authentification impossible", error: err.message })
    }
};