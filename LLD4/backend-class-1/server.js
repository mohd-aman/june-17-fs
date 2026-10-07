const express = require("express");
const connectDB = require("./config/db");
const Item = require("./models/itemModel");

const app = express();

const PORT = 3000;

//Apply this middleware to every incoming request,
// express.json() is a built-in middleware that:
// Step 1: Checks if the request has a JSON body.
// Step 2: Reads the raw bytes.
// Step 3: Parses them into a JavaScript object.
// Step 4: Attaches the result to req.body.
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Health",
  });
});

app.get("/items", async (req, res) => {
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
});

app.post("/items/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Item name is missing",
      });
    }
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
});

//route params - /items/:id
app.put("/items/:id", async (req, res) => {
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
});

app.delete("/items/:id", async (req, res) => {
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
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("SERVER is running on PORT : ", PORT);
  });
});
