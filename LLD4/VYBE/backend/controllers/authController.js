const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const User = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exist",
      });
    }

    //hash the pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log(newUser);

    //send the response back to client with success true

    res.status(201).json({
      success: true,
      message: "User created ",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Oops, Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY },
    );

    //login successfully
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Oops, Something went wrong",
    });
  }
};

const forgetPassword = async (req,res)=>{
  try{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
      res.status(400).json({
        success:false,
        message:"user with the email does not exist"
      })
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(resetToken);
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(resetUrl);
    //todo send email to the user.
    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Oops something went wrong"
    })
  }
}

const resetPassword = async (req,res)=>{
  try{
    const { token } = req.params;
    const { password } = req.body;
    if (!password || typeof password !== "string" || password.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  }catch(err){

  }
}

const getCurrentUser = async (req,res)=>{
  try{
    console.log(req.user);
    const user = await User.findById(req.user.userId).select("-password");
    if(!user){
      return res.status(401).json({
        success:false,
        message:"User not found"
      })
    }
    res.status(200).json({
      success:true,
      message:"User fetched successfully",
      data:user
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong"
    })
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  forgetPassword,
  resetPassword
};
