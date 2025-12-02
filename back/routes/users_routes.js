const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userCtrl = require("../controllers/users_ctrl");

router.get("/isUserConnected", auth, userCtrl.isUserConnected);
router.post('/signUp', userCtrl.signUp);
router.post('/signIn', userCtrl.signIn);
router.post("/disconnect", userCtrl.disconnect);

module.exports = router;