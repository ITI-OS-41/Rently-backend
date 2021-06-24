/** @format */

const {
  categoryIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Category = require("../models/Category");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Category.requiredFields();
  const requestBody = Object.keys(data);

  const idCategoryCheck = await categoryIdCheck(id, res);
  if (Object.keys(idCategoryCheck).length > 0) {
    return res.status(404).json(idCategoryCheck);
  }
  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);
  if (!Object.keys(errors).length) {
    const duplicationCheck = await Category.find({
      name: data.name,
      model: data.model,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "a category with this name has been created before, please choose another name";
        }
      } else {
        errors.duplication =
          "a category with this name has been created before, please choose another name";
      }
    }
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
