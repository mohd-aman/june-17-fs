require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB");
  }catch(error){
    console.log("Failed to connect to MongoDB: ",error.message);
    process.exit(1)//stop the entire application, 1 indicates an error on exit
  }
}

module.exports = connectDB;