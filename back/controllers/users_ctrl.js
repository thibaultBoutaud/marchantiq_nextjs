require("dotenv").config();
const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs').promises;


exports.isUserConnected = async (req, res, next) => {
    try {
        if (req.auth.userId) {
            return res.status(200).json({ isUser: true });
        } else {
            return res.status(400).json({ isUser: false })
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.disconnect = async (req, res, next) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        return res.status(200).json({ msg: "Vous êtes désormais déconnecté" });
    } catch (err) {
        return res.status(500).json({ error: "Erreur serveur lors de la déconnexion" });
    }
};


exports.signUp = async (req, res, next) => {
    try {
        const magicWord = req.body.magicWord;
        if (!magicWord || magicWord !== process.env.MAGIC_WORD) {
            return res.status(400).json({ msg: "Invalid magic word" })
        }

        if (!req.body.name || !req.body.email || !req.body.password) return res.status(400).json({ msg: "All fields are required" });

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ msg: "Invalid email format" });
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        const user = {
            uuid: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            password: hash,
        };

        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: "Email is already taken" });
        }

        // Insérer l'utilisateur dans la base de données
        const [results] = await pool.execute('INSERT INTO users (uuid, name, email, password) VALUES (?,?,?,?)', [user.uuid, user.name, user.email, user.password]);

        // Répondre avec un message de succès
        return res.status(201).json({ msg: "user created", id: results.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

exports.signIn = async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields are required" });

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Invalid email format" });
    }

    const [user] = await pool.execute('SELECT * FROM users WHERE email=?', [email]);
    if (!user[0] || !user[0].email) return res.status(400).json({ msg: "Non existant email" });

    const isPassword = await bcrypt.compare(password, user[0].password);
    if (!isPassword) return res.status(400).json({ msg: "Password invalid" });


    const token = jwt.sign(
        { userId: user[0].id, isAdmin: user[0].isAdmin },
        `${process.env._SECRET_KEY}`,
        { expiresIn: "24h" }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000,
        // sameSite: 'None', // A enlever sur le meme site
        // partitioned: true,
        path: "/"
    });

    res.status(200).json({ msg: "Connection sucessful" });
};