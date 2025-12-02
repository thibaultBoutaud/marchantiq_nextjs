const express = require("express");
const router = express.Router();
const mailsCtrl = require("../controllers/mails_ctrl");
const { uploadItems } = require("../middlewares/multer-config");

router.post("/", uploadItems, mailsCtrl.sendMail);

module.exports = router; 