/** @format */

const {
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");

const ItemRate = require("../models/ItemRate");
module.exports = async (req, res, next) => {
  let errors = {};
  const data = req.body;
  const requiredFields = ItemRate.requiredFields();
  const requestBody = Object.keys(data);

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  

  if (!Validator.isMongoId(data.item)) {
    errors.item = "this is not valid item id";
  } else {
    const item = await Item.findById(data.item);
    if (!item) {
      errors.item = "this item is not found in our database ";
    }
  }
  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);
  
  const duplicationCheck = await ItemRate.find({
    item: data.item,
    rater: data.rater,
  });
  if (duplicationCheck.length) {
    errors.duplication =
      "you can't rate the same item more than one time, please update your review instead";
  }

  

  if (data.rating > 5 || data.rating < 1) {
    errors.rating = "rating  must be between 1 to 5";
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
