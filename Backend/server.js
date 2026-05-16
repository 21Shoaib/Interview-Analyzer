require("dotenv").config() // Must be first
const mongoose = require("mongoose")

const app = require("./src/app")
const db = require("./src/config/database")
const { resume, selfDescription, jobDescription } = require("./src/services/temp")
const generateInterviewReport = require("./src/services/ai.service")
// const  invokeAi  = require("./src/services/ai.service")

db.db_connect()
// invokeAi()
// generateInterviewReport({ resume, selfDescription, jobDescription })

// Add this to your app startup to confirm which DB you're on
mongoose.connection.on("connected", () => {
  console.log("DB Host:", mongoose.connection.host)
  console.log("DB Name:", mongoose.connection.name)
})



const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})