/** @format */
const {
  blogIdCheck,
  commentIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const validator = require("validator");
const Comment = require("../models/Comment");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Comment.requiredFields();
  const requestBody = Object.keys(data);
  
    const idCommentCheck = await commentIdCheck(id, res);
    if (Object.keys(idCommentCheck).length > 0) {
     return res.status(404).json(idCommentCheck)
    }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);
  
  errors = assignErrorsToMissingFields(missingFields);
  
  let difference = getTwoArraysDifferences(requiredFields, missingFields);
  
  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  const idBlogCheck = await blogIdCheck(data.blogPost, res);
  if (Object.keys(idBlogCheck).length > 0) {
    errors.blog="invalid blog id / blog not found"
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
