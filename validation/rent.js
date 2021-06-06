import User from "../models/User"
import Item from "../models/Item"
const Validator = require("validator")
const ObjectId = require('mongoose').Types.ObjectId;

//joi library for validation 

module.exports = async function (data) {
  let errors = {}


  if (Validator.isEmpty(data.owner)) {
    errors.owner = "owner is required"
  }
  if (!Validator.isMongoId(data.owner)) {
    errors.owner = "owner is not valid id"
  }

  const owner = await User.findById(data.owner)

  if (!owner) {
    errors.owner = "owner is not valid user"
  }

  if (Validator.isEmpty(data.renter)) {
    errors.renter = "renter is required"
  }
  if (!Validator.isMongoId(data.renter)) {
    errors.renter = "renter is not valid id"
  }
  const renter = await User.findById(data.renter)

  if (!renter) {
    errors.renter = "renter is not valid user"
  }


  if (data.renter === data.owner) {
    errors.renter = "you can't be the owner and the renter at the same operation"
  }

  if (Validator.isEmpty(data.item)) {
    errors.item = "item is required"
  }

  const item = await Item.findById(data.item);
  if (!item) {
    errors.item = "item is not valid ";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "start rental date is required"
  }

  if (Validator.isEmpty(data.to)) {
    errors.to = "end rental date is required"
  }

  if (Validator.isEmpty(data.insurance)) {
    errors.insurance = "insurance is required"
  }
  if (data.insurance && data.insurance < 1) {
    errors.insurance = "insurance must be greater than 1"
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "price is required"
  }
  if (data.price && data.price < 1) {
    errors.price = "price must be greater than 1"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
