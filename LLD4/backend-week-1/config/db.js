require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB");
  }catch(error){
    console.log("Failed to connect to MongoDB: ",error.message);
  }
}

module.exports = connectDB;