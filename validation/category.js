/** @format */

const {
    assignEmptyErrorsToFields,
    assignErrorsToMissingFields,
    getTwoArraysDifferences,
    missingFieldsChecker,
  } = require("../helpers/errors");
  
  const Category = require("../models/Category");
  module.exports = async (req, res, next) => {
    let errors = {};
    const data = req.body;
    const requiredFields = Category.requiredFields();
    const requestBody = Object.keys(data);
  
    let missingFields = missingFieldsChecker(requestBody, requiredFields);
  
    errors = assignErrorsToMissingFields(missingFields);
  
    let difference = getTwoArraysDifferences(requiredFields, missingFields);
  
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
  