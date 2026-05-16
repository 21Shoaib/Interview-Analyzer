const mongoose = require("mongoose")

require("dotenv").config()

exports.db_connect = () =>{
    mongoose.connect(process.env.MONGO_URI, {})
    .then(()=>{
        console.log("Databse connected successfully");

    })
    .catch((error) => {
        console.log("DB not connected")
        console.error(error)
        process.exit(1);

    })
    
}