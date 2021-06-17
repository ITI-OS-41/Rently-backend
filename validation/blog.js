/** @format */

const {
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Blog = require("../models/Blog");
const validator = require("validator");
module.exports = async (req, res, next) => {
  let errors = {};
  const data = req.body;
  const requiredFields = Blog.requiredFields();
  const requestBody = Object.keys(data);

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };
  if (!validator.isLength(data.title, { min: 4 })) {
    errors.title = `title ${data.title} is shorter than the minimum allowed length (4)`;
  }
  if (Object.keys(errors).length > 0) {
    // console.log(data, errors);
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
