const express = require('express')
const cors=require('cors')
const cookieParser = require('cookie-parser')
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))
app.use(express.json(
    {
        limit: '10mb'
    }
))
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}))

app.use(express.static("public"))//To serve static files such as images, CSS files, and JavaScript files,

app.use(cookieParser())//set up cookie-parser middleware from user browser

module.exports={app}