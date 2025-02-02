const express = require('express')
const cors=require('cors')
const cookieParser = require('cookie-parser')

const logger =require('../src/utils/logger.js')
const morgan=require('morgan')

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
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.static("public"))//To serve static files such as images, CSS files, and JavaScript files,

app.use(cookieParser())//set up cookie-parser middleware from user browser


const studentRouter=require('./routes/student.routes.js')
app.use('/api/v1/students', studentRouter);

module.exports={app}