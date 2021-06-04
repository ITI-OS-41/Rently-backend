const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new Schema({
  receiver: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)
