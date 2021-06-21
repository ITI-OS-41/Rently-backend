/** @format */

const {
  blogIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const validator = require("validator");
const Comment = require("../models/Comment");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.commentId;
  const data = req.body;
  const requiredFields = Blog.requiredFields();
  const requestBody = Object.keys(data);

  const idCheck = await blogIdCheck(req.params.categoryId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }

  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid id";
      return res.status(404).json(errors);
    } else {
      const idCheck = await Comment.findById(id);
      if (!idCheck) {
        errors.id = "comment not found";
        return res.status(404).json(errors);
      }
    }
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
