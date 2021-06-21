/** @format */

const {
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const validator = require("validator");
module.exports = async (req, res, next) => {
  let errors = {};
  const data = req.body;
  const requiredFields = Conversation.requiredFields();
  const requestBody = Object.keys(data);

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  req.body.sender = req.user.id;
  const findDuplication = await Conversation.find({
    members: [req.body.sender, req.body.receiver],
  });
  if (findDuplication.length) {
    errors.duplication = "conversation duplication error";
  }

  if (data.receiver && !errors.receiver) {
    if (!validator.isMongoId(data.receiver)) {
      errors.receiver = "this is not a valid user id";
    } else {
      const receiver = await User.findById(data.receiver);
      if (!receiver) {
        errors.receiver = "this user is not found in our database ";
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    // console.log(data, errors);
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
