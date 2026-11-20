const AppError = require("../utils/AppError");

// If any of these fields is sent, it must be a plain string.
// An object like { "$regex": "^a" } stops here with a 400 and never reaches a query.

const requireStrings =
  (...fields) =>
  (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];

      if (value !== undefined && typeof value !== "string") {
        return next(new AppError(field + " must be text", 404));
      }
    }

    next();
  };

module.exports = requireStrings;


//  const middleware =  requireStrings("email","password");