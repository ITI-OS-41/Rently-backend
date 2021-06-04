
const Validator = require("validator")
const ObjectId = require('mongoose').Types.ObjectId;
import User from "../models/User"

module.exports = async function (data) {
  let errors = {}


  if (Validator.isEmpty(data.receiver)) {
    errors.receiver = "receiver is required"
  }

  if (data.receiver) {
    const receiver = await User.findById(data.receiver)
    if (!receiver) {
      errors.receiver = "receiver is not valid user"
    }
  }


  if (Validator.isEmpty(data.sender)) {
    errors.sender = "sender is required"
  }

  if (data.sender) {
    const sender = await User.findById(data.sender)
    if (!sender) {
      errors.sender = "sender is not valid user"
    }
  }


  if (Validator.isEmpty(data.content)) {
    errors.content = "content is required"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
