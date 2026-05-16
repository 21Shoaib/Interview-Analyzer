const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

require("dotenv").config()

async function authUser(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Token not provided"
        })
    }

    const isTokenBlacklist = await tokenBlacklistModel.findOne({token}) 

    if(isTokenBlacklist){
        return res.status(401).json({
            success : false,
            message : "Token is invalid"
        })
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decode

        next()
    }
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Invalid token"
        })
        console.log (error);
    }
}

module.exports = {authUser}