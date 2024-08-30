import mongoose from "mongoose";
import colors from "colors";

export default async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(e){
        console.error("Failed to connect to database");
    }
};