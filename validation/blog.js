/** @format */

const {
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Blog = require("../models/Blog");
const User = require("../models/User");

const Validator = require("validator");

module.exports = async (req, res, next) => {
  let errors = {};
  let data = req.body;
  const id = req.params.id;
  const requiredFields = Blog.requiredFields();
  const requestBody = Object.keys(data);

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  if (!errors["author"]) {
    if (Validator.isMongoId(data.author)) {
      const author = await User.findById(data.author);
      if (!author) {
        errors.author = "this author is not found";
      }
    } else {
      errors.author = "this is an invalid user id";
    }
  }

  if (Object.keys(errors).length > 0) {
    // console.log(data, errors);
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
