const Item = require("../models/itemModel");

const getAllItems = async (req, res) => {
  try {
    const allItems = await Item.find();
    res.json({
      success: true,
      data: allItems,
      message: "Data Retrieved success",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createItem = async (req, res) => {
  try {
    const { name } = req.body;
    const newItem = await Item.create({ name });
    res.status(201).json({
      success: true,
      data: newItem,
      message: "Item added",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name }, // value to update
      { new: true }, // return updated value
    );
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      data: deletedItem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
