const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs').promises;


exports.getThreadsByNews = async (req, res, next) => {
    try {
        const news_uuid = req.params.news_uuid;
        const [threads] = await pool.execute("SELECT * from threads WHERE news_uuid = ?", [news_uuid]);

        if (threads.length === 0) throw new Error("Aucun threads n'est disponible");

        res.status(200).json({ threads: threads });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOneThread = async (req, res, next) => {
    try {
        const threads_uuid = req.params.threads_uuid;
        const [threads] = await pool.execute("SELECT * from threads WHERE uuid = ?", [threads_uuid]);
        const thread = threads[0];
        if (threads.length === 0) throw new Error("Aucun threads n'est disponible");

        res.status(200).json({ thread: thread });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createThreads = async (req, res, next) => {
    try {
        const news_uuid = req.params.news_uuid;
        const { sous_titre, description } = req.body;
        if (!sous_titre || !description) throw new Error("sous-titre et description obligatoire");

        const uuid = uuidv4();

        const [news] = await pool.execute("SELECT * FROM news WHERE uuid = ?", [news_uuid]);
        if (news.length === 0) throw new Error("News introuvable");
        await pool.execute("INSERT INTO threads (uuid, news_uuid, sous_titre, description) VALUES(?, ?, ?, ?)", [uuid, news[0].uuid, sous_titre, description]);

        return res.status(201).json({ msg: "Thread ajouté !", uuid: uuid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// exports.updateThreads = async (req, res, next) => {
//     try {
//         const uuid = req.params.uuid;
//         const { sous_titre, description } = req.body;

//         const threadsData = {
//             sous_titre: sous_titre || null,
//             description: description || null
//         };

//         const keys = Object.keys(threadsData);
//         const currentKeys = keys.filter((cell) => threadsData[cell] !== null);
//         const values = Object.values(threadsData);
//         const currentValues = values.filter((cell) => cell !== null);

//         const placeholder = currentKeys.map((cell) => `${cell} = ?`).join(", ");

//         await pool.execute(`UPDATE INTO threads SET ${placeholder}`, [currentValues]);

//         res.status(200).json({ msg: "Thread modifié" });
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// };

exports.deleteThreads = async (req, res, next) => {
    try {
        const uuid = req.params.uuid;

        const [threads] = await pool.execute("SELECT FROM threads WHERE uuid = uuid", [uuid]);
        const thread = threads[0];
        if (!thread) throw new Error("Thread introuvable");

        await pool.execute("DELETE FROM threads WHERE uuid = ?", [uuid]);

        res.status(200).json({ msg: "Threads supprimé" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createThreadImg = async (req, res, next) => {
    try {
        const threads_uuid = req.params.threads_uuid;
        const [threads] = await pool.execute("SELECT * FROM threads WHERE uuid = ?", [threads_uuid]);

        if (threads.length === 0) throw new Error("Threads introuvable");
        const thread = threads[0];
        const { commentaire } = req.body;

        const fileName = req.file ? req.file.filename : null;
        if (!fileName) throw new Error("Image obligatoire");

        const threadImgUuid = uuidv4();

        await pool.execute("INSERT INTO threads_images(uuid, thread_uuid, img_url, commentaire) VALUES (?, ?, ?, ?)", [threadImgUuid, thread.uuid, fileName, commentaire]);

        res.status(201).json({ msg: "Thread complémentaire ajouté" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateThreads = async (req, res, next) => {
    try {
        const threads_uuid = req.params.threads_uuid;
        const { sous_titre, description } = req.body;

        const data = {
            sous_titre: sous_titre || null,
            description: description || null
        };

        const keys = Object.keys(data).filter((key) => data[key] !== null);
        const values = Object.values(data).filter((value) => value !== null);
        values.push(threads_uuid);

        const placeholder = keys.map((key) => `${key} = ?`).join(", ");

        await pool.execute(`UPDATE threads SET ${placeholder} WHERE uuid = ?`, values);

        res.status(200).json({ msg: "Thread updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateThreadImg = async (req, res, next) => {
    try {
        const uuid = req.params.threadsImg_uuid;
        const fileName = req.file ? req.file.filename : null;
        const { commentaire } = req.body;

        const [threadsImg] = await pool.execute("SELECT * FROM threads_images WHERE uuid = ?", [uuid]);
        if (threadsImg.length === 0) throw new Error("Thread complémentaire introuvable");
        const threadImg = threadsImg[0];

        const data = {
            img_url: fileName || null,
            commentaire: commentaire || null
        };


        if (fileName) await fs.unlink(`uploads/pictures/threads/${threadImg.img_url}`);

        const keys = Object.keys(data).filter((cell) => data[cell] !== null);
        const values = Object.values(data).filter((cell) => cell !== null);
        const placeholder = keys.map((cell) => `${cell} = ?`).join(", ");
        values.push(uuid);

        await pool.execute(`UPDATE threads_images SET ${placeholder} WHERE uuid = ?`, values);

        res.status(200).json({ msg: "Thread complémentaire mis à jour !" })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.deleteThreads = async (req, res, next) => {
    try {
        const uuid = req.params.threads_uuid;

        const [threads] = await pool.execute("SELECT * FROM threads WHERE uuid = ?", [uuid]);
        if (threads.length === 0) throw new Error("Thread complémentaire introuvable");
        const thread = threads[0];

        const [threadsImg] = await pool.execute("SELECT * FROM threads_images WHERE thread_uuid = ?", [uuid]);
        if (threadsImg.length > 0) {
            await Promise.all(
                threadsImg.forEach(async (cell) => {
                    await fs.unlink(`uploads/pictures/threads/${cell.img_url}`);
                })
            )
        }


        await pool.execute("DELETE FROM threads WHERE uuid = ?", [uuid]);

        res.status(200).json({ msg: "Thread complémentaire supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteThreadImg = async (req, res, next) => {
    console.log("ctrl__delete thread img")
    try {
        const uuid = req.params.threadsImg_uuid;
        const [threadImg] = await pool.execute("SELECT * FROM threads_images WHERE uuid = ?", [uuid]);
        if (threadImg.length === 0) throw new Error("Img absente");
        const thread_img = threadImg[0];

        await fs.unlink(`uploads/pictures/threads/${thread_img.img_url}`);

        await pool.execute("DELETE FROM threads_images WHERE uuid = ?", [uuid]);
        res.status(200).json({ msg: "thread img + commentaire deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};