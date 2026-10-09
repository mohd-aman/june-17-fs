function validateItem(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Item name is missing",
    });
  }
  next();
}

module.exports = {validateItem};