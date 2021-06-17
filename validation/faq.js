/** @format */

const {
    assignEmptyErrorsToFields,
    assignErrorsToMissingFields,
    getTwoArraysDifferences,
    missingFieldsChecker,
  } = require("../helpers/errors");
  
  const FAQ = require("../models/FAQ");
  module.exports = async (req, res, next) => {
    let errors = {};
    const data = req.body;
    const requiredFields = FAQ.requiredFields();
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
  