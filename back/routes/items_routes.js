const express = require("express");
const router = express.Router();
const itemsCtrl = require("../controllers/items_ctrl");
const auth = require("../middlewares/auth");
const { uploadItems } = require("../middlewares/multer-config");

router.get("/", itemsCtrl.getItems);
router.get("/:uuid", itemsCtrl.getOneItem);
router.get("/byCategory/:category", itemsCtrl.getItemsByCategory);
router.get("/bySearch/:searchedValue", itemsCtrl.getItemsByResearch);
router.post("/", auth, itemsCtrl.createItem);
router.post("/images/:uuid", auth, uploadItems, itemsCtrl.addImage);
router.put("/:uuid", auth, itemsCtrl.updateItem);
router.put("/images/:imgUuid", auth, uploadItems, itemsCtrl.updateItemImage);
router.delete("/:uuid", auth, itemsCtrl.deleteItem);
router.delete("/images/:imgUuid", auth, itemsCtrl.deleteItemImg); 

module.exports = router; 