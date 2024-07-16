import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO,{
        dbName:"RESTAURANT_MERN",
    })
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(`some error occured: ${err}`);
    });
};