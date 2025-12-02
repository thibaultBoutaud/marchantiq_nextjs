const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs').promises;

exports.getNews = async (req, res, next) => {
    try {
        const [preNews] = await pool.execute("SELECT * FROM news");
        if (preNews.length === 0) {
            throw new Error("News empties");
        }

        const news = await Promise.all(
            preNews.map(async (cell) => {
                const [threads] = await pool.execute("SELECT * FROM threads WHERE news_uuid = ?", [cell.uuid]);
                cell.threads = threads;
                const images = await Promise.all(
                    cell.threads.map(async (cell2) => {
                        const [threadsImg] = await pool.execute("SELECT * FROM threads_images WHERE thread_uuid = ?", [cell2.uuid]);
                        cell2.images = threadsImg;
                        return cell2;
                    })
                )
                return cell;
            })
        );

        return res.status(200).json({ news: news });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getNewsByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;

        const [preNews] = await pool.execute("SELECT * FROM news WHERE category = ?", [category]);
        if (preNews.length === 0) throw new Error("news empty");

        const news = await Promise.all(
            preNews.map(async (cell) => {
                const [threads] = await pool.execute("SELECT * FROM threads WHERE news_uuid = ?", [cell.uuid]);
                cell.threads = threads;
                const images = await Promise.all(
                    cell.threads.map(async (cell2) => {
                        const [threadsImg] = await pool.execute("SELECT * FROM threads_images WHERE thread_uuid = ?", [cell2.uuid]);
                        cell2.images = threadsImg;
                        return cell2;
                    })
                )
                return cell;
            })
        );

        res.status(200).json({ news: news });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getOneNews = async (req, res, next) => {
    try {
        const uuid = req.params.uuid;
        const [preNews] = await pool.execute("SELECT * FROM news WHERE uuid = ?", [uuid]);
        if (preNews.length === 0) {
            throw new Error("News empties");
        }

        let oneNews = preNews[0];
        const [preThreads] = await pool.execute("SELECT * FROM threads WHERE news_uuid = ?", [uuid]);
        oneNews.threads = preThreads;

        const threads = await Promise.all(
            oneNews.threads.map(async (cell) => {
                const [threads_img] = await pool.execute("SELECT * FROM threads_images WHERE thread_uuid = ?", [cell.uuid]);
                cell.images = threads_img;
                return cell;
            })
        )
        oneNews.threads = threads;
        return res.status(200).json({ oneNews: oneNews });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.createNews = async (req, res, next) => {
    try {
        const { titre, category, description } = req.body;
        if (!titre || !category || !description) throw new Error("Veuillez remplir tous les champs");

        const fileName = req.file ? req.file.filename : null;
        if (!fileName) throw new Error("Image obligatoire");

        const uuid = uuidv4();

        await pool.execute("INSERT INTO news (uuid, titre, category, description, img_url) VALUES(?, ?, ?, ?, ?)", [uuid, titre, category, description, fileName]);

        res.status(201).json({ msg: "News created !", uuid: uuid });

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
};

exports.updateNews = async (req, res, next) => {
    try {
        const uuid = req.params.uuid;

        const [news] = await pool.execute("SELECT * FROM news WHERE uuid = ?", [uuid]);
        const currentNews = news[0];
        if (!currentNews) throw new Error("News introuvable");

        const { titre, category, description } = req.body;
        const fileName = req.file ? req.file.filename : null;

        if (fileName) await fs.unlink(`uploads/pictures/news/${currentNews.img_url}`);

        const newsData = {
            titre: titre || null,
            category: category || null,
            description: description || null,
            img_url: fileName || null
        };

        const keys = Object.keys(newsData).filter((key) => newsData[key] !== null);
        const values = Object.values(newsData).filter((value) => value !== null);
        const placeHolder = keys.map((cell) => `${cell} = ?`).join(", ");
        values.push(uuid);

        await pool.execute(`UPDATE news SET ${placeHolder} WHERE uuid = ?`, values);

        return res.status(200).json({ msg: "Objet updated" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const path = require("path");

exports.deleteNews = async (req, res, next) => {
    try {
        const uuid = req.params.uuid;

        const [news] = await pool.execute("SELECT * FROM news WHERE uuid = ?", [uuid]);
        const currentNews = news[0];
        if (!currentNews) throw new Error("News introuvable");

        // ➤ Chemin de l'image principale de la news
        const newsImgPath = path.join(__dirname, "../uploads/pictures/news", currentNews.img_url);

        try {
            await fs.unlink(newsImgPath);
        } catch (err) {
            if (err.code !== "ENOENT") throw err;
        }

        // ➤ Supprimer les images des threads liés
        const [threads] = await pool.execute("SELECT * FROM threads WHERE news_uuid = ?", [uuid]);

        for (const thread of threads) {
            const [threadImgs] = await pool.execute("SELECT * FROM threads_images WHERE thread_uuid = ?", [thread.uuid]);

            for (const img of threadImgs) {
                const threadImgPath = path.join(__dirname, "../uploads/pictures/threads", img.img_url);
                try {
                    await fs.unlink(threadImgPath);
                } catch (err) {
                    if (err.code !== "ENOENT") throw err;
                }
            }
        }

        // ➤ Supprimer la news (et ses threads et images grâce au ON DELETE CASCADE)
        await pool.execute("DELETE FROM news WHERE uuid = ?", [uuid]);

        res.status(200).json({ msg: "News et images supprimées avec succès" });

    } catch (err) {
        console.error("Erreur suppression news :", err);
        res.status(500).json({ error: err.message });
    }
};

