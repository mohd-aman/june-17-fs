const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

const register = async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }
    //check if user already exist
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User with this email already exist"
      })
    }

    //hash the pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await User.create({
      name,
      email,
      password:hashedPassword
    })

    console.log(newUser);

    //send the response back to client with success true

    res.status(201).json({
      success:true,
      message:"User created ",
      data: {
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        role:newUser.role
      }
    })
    
  }catch(err){
    res.status(500).json({
      success:false,
      message:"Oops, Something went wrong"
    })
  }
}

const login = async (req,res)=>{
  try{
    const {email,password} = req.body;
    //validate email and password
    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Email and Password are required"
      })
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({
        success:false,
        message:"Invalid Credentials"
      })
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(401).json({
        success:false,
        message:"Invalid Credentials"
      })
    }

    //login successfully
    res.status(200).json({
      success:true,
      message:"Login successfully",
      data:{
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    })

  }catch(err){
    res.json(500).json({
      success:false,
      message:"Oops, Something went wrong"
    })
  }
}

module.exports = {
  register,
  login
}