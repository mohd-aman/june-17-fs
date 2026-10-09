const express = require("express");
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const router = express.Router();

router.get("/", getAllItems);
router.post("/add", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
