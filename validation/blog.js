import User from "../models/User"
const Validator = require("validator")


module.exports = async function (data) {
    let errors = {}

if (Validator.isEmpty(data.author)) {
    errors.author = "author is required"
  }
  
  if (!Validator.isMongoId(data.author)) {
    errors.author = "this is not a valid author id";
  } else {
    const author = await User.findById(data.author);
    if (!author) {
      errors.author = "this author is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "title is required"
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "description is required"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
}
}