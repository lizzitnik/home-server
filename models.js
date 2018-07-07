const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  }
})

const TodoSchema = mongoose.Schema({
  value: {
    type: String
  },
  completed: {
    type: Boolean
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || "",
    firstName: this.firstName || "",
    lastName: this.lastName || ""
  }
}

TodoSchema.methods.serialize = function() {
  return {
    id: this._id,
    value: this.value,
    completed: this.completed,
    userId: this.userId
  }
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 6)
}

const User = mongoose.model("User", UserSchema)
const Todo = mongoose.model("Todo", TodoSchema)

module.exports = {
  User,
  Todo
}
