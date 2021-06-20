/** @format */

const {
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");

const SubCategory = require("../models/SubCategory");
module.exports = async (req, res, next) => {
  let errors = {};
  const data = req.body;
  const requiredFields = SubCategory.requiredFields();
  const requestBody = Object.keys(data);

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  const duplicationCheck = await SubCategory.find({
    name: data.name,
    category: data.category,
  });
  if (duplicationCheck.length) {
    errors.duplication =
      "you can't rate the same item more than one time, please update your review instead";
  }

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  if (Object.keys(errors).length > 0) {
    // console.log(data, errors);
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
