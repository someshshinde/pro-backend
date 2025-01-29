
require('dotenv').config();
const mongoose =require('mongoose')

const connectDB = async () => {

    try {
        const connectionInstance=await mongoose.connect(process.env.MongoDB_URI)
        console.log("Database connected successfully");
    
    } catch (error) {
        console.error("Database connection error:", err);
    }



}

module.exports={connectDB}