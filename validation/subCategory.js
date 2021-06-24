/** @format */

const {
  subCategoryIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const SubCategory = require("../models/SubCategory");
module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = SubCategory.requiredFields();
  const requestBody = Object.keys(data);

  const idSubCategoryCheck = await subCategoryIdCheck(id, res);
  if (Object.keys(idSubCategoryCheck).length > 0) {
    return res.status(404).json(idSubCategoryCheck);
  }
  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  if (!Object.keys(errors).length) {
    const duplicationCheck = await SubCategory.find({
      name: data.name,
      category: data.category,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "a with this name has been created before in this category, please choose another name";
        }
      } else {
        errors.duplication =
          "a subCategory with this name has been created before in this category, please choose another name";
      }
    }
  }

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
