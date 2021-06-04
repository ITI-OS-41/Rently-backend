
const Validator = require("validator")
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = function (data) {
  let errors = {}

  if (!ObjectId.isValid(data.id)) {
    errors.id = "id is not valid id"
  }

  if (Validator.isEmpty(data.receiver)) {
    errors.receiver = "receiver is required"
  }
  if (!ObjectId.isValid(data.receiver)) {
    errors.receiver = "receiver is not valid id"
  }

  if (Validator.isEmpty(data.sender)) {
    errors.sender = "sender is required"
  }
  if (!ObjectId.isValid(data.sender)) {
    errors.sender = "sender is not valid id"
  }


  if (Validator.isEmpty(data.content)) {
    errors.content = "content is required"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
