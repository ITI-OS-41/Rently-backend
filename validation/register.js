const Validator = require("validator")

module.exports = function (data) {
  let errors = {}

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required"
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid"
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "username is required"
  }
  if (!Validator.isLength(data.username, { min: 3, max: 30 })) {
    errors.username = "username must be between 3 to 30"
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "password is required"
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password must be between 6 to 30"
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "confirm password is required"
  }
  if (!Validator.equals(data.confirmPassword, data.password)) {
    errors.confirmPassword = "confirm password must match password"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
