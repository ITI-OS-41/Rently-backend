/** @format */

const {
  blogIdCheck,
  categoryIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const validator = require("validator");
const Blog = require("../models/Blog");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Blog.requiredFields();
  const requestBody = Object.keys(data);

  const idBlogCheck = await blogIdCheck(id, res);
  if (Object.keys(idBlogCheck).length > 0) {
    return res.status(404).json(idBlogCheck);
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  const idCategoryCheck = await categoryIdCheck(data.category, res);
  if (Object.keys(idCategoryCheck).length > 0) {
    errors.category = idCategoryCheck;
  }

  if (
    data.title &&
    !validator.isLength(data.title, { min: 4 }) &&
    !errors.title
  ) {
    errors.title = `title ${data.title} is shorter than the minimum allowed length (4)`;
  }

  if (!errors.category) {
    const duplicationCheck = await Blog.find({
      title: data.title,
      category: data.category,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "a blog with this title has been published in this category, please choose another title";
        }
      } else{
        errors.duplication =
          "a blog with this title has been published in this category, please choose another title";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
