const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "partner", "admin"],
      default: "user",
    },
    resetPasswordToken:{
      type:String,
      default:null
    },
    resetPasswordExpiry:{
      type:Date,
      default:null
    }
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User",userSchema);

module.exports = User;