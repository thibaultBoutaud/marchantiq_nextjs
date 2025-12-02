const express = require("express");
const router = express.Router();
const newsCtrl = require("../controllers/news_ctrl");
const auth = require("../middlewares/auth");
const { uploadNews } = require("../middlewares/multer-config");

router.get("/", newsCtrl.getNews);
router.get("/byCategory/:category", newsCtrl.getNewsByCategory);
router.get("/:uuid", newsCtrl.getOneNews);
router.post("/", auth, uploadNews, newsCtrl.createNews);
router.put("/:uuid", auth, uploadNews, newsCtrl.updateNews);
router.delete("/:uuid", auth, newsCtrl.deleteNews);

module.exports = router;   