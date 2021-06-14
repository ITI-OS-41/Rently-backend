const Validator = require("validator");
const User = require("../models/User");
const AppRate = require("../models/AppRate");

module.exports = async function (data) {
  let errors = {};

  if (Validator.isEmpty(data.rater)) {
    errors.rater = "rater is required";
  }

  // refactor, usercheck middleware

  if (!Validator.isMongoId(data.rater)) {
    errors.rater = "this is not valid user id";
  } else {
    const rater = await User.findById(data.rater);
    if (!rater) {
      errors.rater = "this rater is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.site)) {
    errors.site = "application name to be rated is required";
  } else {
    if (data.site !== "Rently")
    errors.site = "you are in Rently application, seems like you are lost"
  }


  const duplicationCheck = await AppRate.find({
    site: data.site,
    rater: data.rater,
  });
  if (duplicationCheck.length > 0) {
    errors.duplication =
      "you can't rate our application more than one time, please update your review instead";
  }

  if (Validator.isEmpty(data.rating)) {
    errors.rating = "rating is required";
  }

  if (data.rating > 5 || data.rating < 1) {
    errors.rating = "rating  must be between 1 to 5";
  }

  if (Validator.isEmpty(data.comment)) {
    errors.comment = "comment is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
