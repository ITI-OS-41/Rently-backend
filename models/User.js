const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    trim:true,
    required: true,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
})

module.exports = mongoose.model("User", userSchema)
