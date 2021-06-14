
const Validator = require("validator")
const ObjectId = require('mongoose').Types.ObjectId;
const User = require("../models/User"); 

module.exports = async function (data) {
  let errors = {}


  if (Validator.isEmpty(data.receiver)) {
    errors.receiver = "receiver is required"
  } else if (!Validator.isMongoId(data.receiver)) {
    errors.receiver = "this is not valid user id";
  } else {
    const rater = await User.findById(data.receiver);
    if (!rater) {
      errors.receiver = "this user is not found in our database ";
    }
  }



  if (Validator.isEmpty(data.sender)) {
    errors.sender = "sender is required"
  } else if (!Validator.isMongoId(data.sender)) {
    errors.sender = "this is not valid user id";
  } else {
    const rater = await User.findById(data.sender);
    if (!rater) {
      errors.sender = "this user is not found in our database ";
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
