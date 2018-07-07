const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const axios = require("axios")
const passport = require("passport")

const jwtAuth = passport.authenticate("jwt", {
  session: false
})

const { Todo, User } = require("../models")

router.get('/', jwtAuth, (req, res) => {
  Todo.find({userId: req.user.id})
    .then(todos => {
      res.json(todos.map(todo => todo.serialize()))
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: err
      })
    })
})

router.get("/:id", (req, res) => {
  Todo.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: "something went horribly awry"
      })
    })
})

router.post("/", jwtAuth, (req, res) => {
  const requiredField = "todo-input"
  if (!(requiredField in req.body)) {
    const message = `Missing \`${requiredField}\` in request body`
    console.error(message)
    return res.status(400).send(message)
  }
  console.log("rendering req.body" + req.body)
  Todo.create({
    value: req.body["todo-input"],
    completed: false,
    userId: req.user.id

  })
    .then(todo => {
      res.status(201).json(todo.serialize())
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      })
    })
})

router.put("/:id", (req, res) => {
  const updated = {}
  const updatableFields = ["completed"]
  updatableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  })
  Todo.findById(req.params.id)
    .then(todo => {
      return Todo.findByIdAndUpdate(
        todo._id,
        {
          $set: {
            completed: !todo.completed
          }
        },
        {
          new: true
        }
      )
    })
    .then(updatedPost => {
      res.status(201).json(updatedPost.serialize())
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
})

router.delete("/:id", jwtAuth, (req, res) => {
  Todo.find({userId: req.user.id, _id: req.params.id})
    .then(todo => {
      res.json(todo[0].serialize())
      todo[0].remove()
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: "something went terribly wrong"
      })
    })
})

module.exports = router
