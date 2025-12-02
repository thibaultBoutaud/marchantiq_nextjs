const express = require("express");
const router = express.Router();
const threadsCtrl = require("../controllers/threads_ctrl");
const auth = require("../middlewares/auth");
const { uploadThreads } = require("../middlewares/multer-config");

router.get("/:news_uuid", threadsCtrl.getThreadsByNews);
router.get("/oneThread/:threads_uuid", threadsCtrl.getOneThread);
router.post("/:news_uuid", auth, threadsCtrl.createThreads);
router.post("/addImg/:threads_uuid", auth, uploadThreads, threadsCtrl.createThreadImg);
router.put("/updateThread/:threads_uuid", auth, threadsCtrl.updateThreads);
router.put("/updateThreadImg/:threadsImg_uuid", auth, uploadThreads, threadsCtrl.updateThreadImg);
router.delete("/deleteThread/:threads_uuid", auth, threadsCtrl.deleteThreads);
router.delete("/deleteThreadImg/:threadsImg_uuid", auth, threadsCtrl.deleteThreadImg); 

module.exports = router;  