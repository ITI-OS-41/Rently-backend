const Validator = require("validator")
import User from "../models/User"
// // import Item from "../models/Item"

module.exports = async function (data) {
  let errors = {}

  if (Validator.isEmpty(data.rater)) {
    errors.rater = "rater is required"
  }

  
  const rater = await User.findById(data.rater)

  if (!rater) {
    errors.rater = "rater is not valid user"
  }

  if (Validator.isEmpty(data.item)) {
    errors.item = "item is required"
  }


  // if (data.item) {
  //   const item = await Item.findById(data.item)
  //   if (!item) {
  //     errors.item = "item is not valid "
  //   }
  // }

  if (Validator.isEmpty(data.rating)) {
    errors.rating = "rating is required"
  }

  if (!Validator.isLength(data.rating, { min: 1, max: 5 })) {
    errors.rating = "rating  must be between 1 to 5"
  }

  if (Validator.isEmpty(data.comment)) {
    errors.comment = "comment is required"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
  }