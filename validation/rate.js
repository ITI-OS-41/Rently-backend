const Validator = require("validator")

module.exports = function (data) {
  let errors = {}

  if (Validator.isEmpty(data.ratingNumber)) {
    errors.ratingNumber = "ratingNumber is required"
  }

  if (!Validator.isLength(data.ratingNumber, { min: 1, max: 5 })) {
    errors.ratingNumber = "rating Number must be between 1 to 5"
  }
  if (!Validator.isLength(data.totalPoints, { min: 5, max: 5 })) {
    errors.totalPoints = "total Points must be 5"
  }


  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
