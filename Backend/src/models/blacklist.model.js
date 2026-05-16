const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token :{
        type : String,
        required : [true, "Token is required to be in balcklist"]
    }
}, {timestamps : true})

module.exports = mongoose.model("blacklistToken", blacklistTokenSchema)