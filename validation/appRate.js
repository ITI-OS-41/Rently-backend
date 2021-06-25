const {
  appRateIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const AppRate = require("../models/AppRate");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = AppRate.requiredFields();
  const requestBody = Object.keys(data);

  const idAppRateCheck = await appRateIdCheck(id, res);
  if (Object.keys(idAppRateCheck).length > 0) {
    return res.status(404).json(idAppRateCheck);
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  if (!errors.rating){
  if(!isNaN(data.rating)){

    if (data.rating > 5 || data.rating < 1) {
      errors.rating = "rating  must be between 1 to 5";
    }
  }
    else{
      errors.rating="rating should be a number value"
    }
  }
  if (Object.keys(errors).length===0) {
    const duplicationCheck = await AppRate.find({
      rater: req.user.id,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "you can't rate our application more than one time, please update your review instead";
        }
      } else {
        errors.duplication =
          "you can't rate our application more than one time, please update your review instead";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
