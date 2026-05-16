const userModel = require("../models/user.model")
const tokenBlacklistModel = require("../models/blacklist.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


//user Controller
exports.registerUserController = async (req, res)=> {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            success : false,
            message : "Required field is empty!"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if(isUserAlreadyExist){
        return res.status(400).json({
            success : false,
            message : "User already exists with this email or username"
        })
    } 

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password : hash
    })

    const token = jwt.sign(
        {id : user._id, username : user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        success : true,
        message : "User registered successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })



}

//login Controller
exports.loginUserController = async (req, res) => {
    const {email, password} = req.body;

    const  user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            success : false,
            message : "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            success : false,
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id : user._id, username : user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )

    res.cookie("token", token)

    res.status(200).json({
        success : true,
        message : "User logged in successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })

    
}



//logOut Controller
exports.logOutUserController = async (req, res) => {
    const token = req.cookies.token
    console.log("Cookies:", req.cookies)

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        success : true,
        message : "User logged Out successfully"
        
    })

    
}

//get-me Controller
exports.getMeController = async (req, res) => {
    
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        success : true,
        message : "User details fetched successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email,

        }
    })
}

