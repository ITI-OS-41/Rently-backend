const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const Validator = require("validator");

module.exports = async function (data) {
  let errors = {};

  if (Validator.isEmpty(data.category)) {
    errors.category = "Category is required";
  }

  if (!Validator.isMongoId(data.category)) {
    errors.category = "this is not a valid category id";
  } else {
    const category = await Category.findById(data.category);
    if (!category) {
      errors.category = "this category is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.subcategory)) {
    errors.subcategory = "SubCategory is required";
  }

  if (!Validator.isMongoId(data.subcategory)) {
    errors.subcategory = "this is not a valid subcategory id";
  } else {
    const subcategory = await SubCategory.findById(data.subcategory);
    if (!subcategory) {
      errors.subcategory = "this subcategory is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.condition)) {
    errors.condition = "item Condition is required";
  }
  const condition = ["perfect", "very good", "descent", "good", "fair"];
  if (data.condition && !condition.includes(data.condition)) {
    errors.condition = `${data.condition} is not an accepted value for condition`;
  }

  if (Validator.isEmpty(data.stock)) {
    errors.condition = "item Condition is required";
  }

  if (Validator.isEmpty(data.photo)) {
    errors.condition = "item Photo is required";
  }

  if (data.location.type !== "Point") {
    errors.location = "item location type must be Point";
  }

  if (data.location.coordinates.length !== 2) {
    errors.location = "item location coordinates are invalid";
  }

  if (data.location.coordinates.length < 1) {
    errors.location = "item location coordinates are required";
  }

  if (Validator.isEmpty(data.location.address)) {
    errors.location = "item location address is required";
  }

  if (Validator.isEmpty(data.cancellation)) {
    errors.cancellation = "item cancellation type is required";
  }

  const cancellation = ["Easygoing", "Reasonable", "Strict"];
  if (data.cancellation && !cancellation.includes(data.cancellation)) {
    errors.cancellation = `${data.cancellation} is not an accepted value for cancellation`;
  }

  if (data.price <= 0) {
    errors.price = "item price should be bigger than 1";
  }
  if (Validator.isEmpty(data.deliverable)) {
    errors.deliverable = "item delivery should be determined";
  }

  if (data.deliverable !== true && data.deliverable !== false) {
    errors.deliverable = "item delivery should be a true false statement";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Item's name is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description is required";
  }

  if (Validator.isEmpty(data.owner)) {
    errors.owner = "owner is required";
  }

  if (!Validator.isMongoId(data.owner)) {
    errors.owner = "this is not a valid owner id";
  } else {
    const owner = await User.findById(data.owner);
    if (!owner) {
      errors.owner = "this user is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "status is required";
  }

  if (data.status !== "true" && data.status !== "false") {
    errors.status = "item status should be a true false statement";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
