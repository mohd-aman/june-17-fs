const express = require("express");
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const {validateItem} = require('../middleware/common')

const router = express.Router();

router.get("/", getAllItems);
router.post("/add",validateItem ,createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
