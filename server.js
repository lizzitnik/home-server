'use strict'
require("dotenv").config()

const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const { PORT, DATABASE_URL } = require("./config")
const app = express()
const mongoose = require("mongoose")
const passport = require("passport")
mongoose.Promise = global.Promise

const weatherRouter = require("./routers/weatherRouter")
const todoRouter = require("./routers/todoRouter")
const quoteRouter = require("./routers/quoteRouter")
const userRouter = require("./routers/userRouter")
const authRouter = require("./routers/authRouter")
const { localStrategy, jwtStrategy } = require("./routers/authStrategies")

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
  next()
})

app.use(
    cors({
        origin: 'https://home-app11.herokuapp.com/'
    })
);

passport.use(localStrategy)
passport.use(jwtStrategy)

app.use(bodyParser.json())
app.use(weatherRouter)
app.use("/todos", todoRouter)
app.use("/users", userRouter)
app.use("/quote", quoteRouter)
app.use("/auth", authRouter)


const jwtAuth = passport.authenticate("jwt", {
  session: false
})

app.get("/protected", jwtAuth, (req, res) => {
  return res.json({
    data: "rosebud"
  })
})

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" })
})

let server

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`)
          resolve(server)
        })
        .on("error", err => {
          mongoose.disconnect()
          reject(err)
        })
    })
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server")
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err))
}

module.exports = { app, runServer, closeServer }
