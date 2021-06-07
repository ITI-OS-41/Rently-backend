import User from '../models/User'
const Validator = require("validator")

module.exports = async function (data) {
  let errors = {}

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required"
  }

  const email = await User.findOne({ email: data.email })
  if (email) {
    errors.email = "email already taken"
  }


  if (Validator.isEmpty(data.username)) {
    errors.username = "username is required"
  }

  const username = await User.findOne({ username: data.username })
  if (username) {
    errors.username = "username already taken"
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
