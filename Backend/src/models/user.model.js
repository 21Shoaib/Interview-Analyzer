const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true, "User name already taken"],
        required : true
    },
    email : {
        type : String,
        unique : [true, "Account already exist"],
        required : true
    },
    password : {
        type : String,
        
        required : true
    },
}, {timestamps : true})

module.exports = mongoose.model("User", userSchema)