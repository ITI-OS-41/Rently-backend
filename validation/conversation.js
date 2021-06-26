/** @format */

const {
  userIdCheck,
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

  if (data.members && !errors.members) {
    const idreceiverCheck = await userIdCheck(data.members, res);
    if (Object.keys(idreceiverCheck).length > 0) {
      return res.status(404).json(idreceiverCheck);
    }
    else if(data.sender == data.members) {
      errors.duplication="you can't start a conversation with yourself, please choose another user"
    }
  }
  
  // if (!errors.members) {
  //   req.body.sender = req.user.id;
  //   const findDuplication = await Conversation.find({
  //     members: [req.body.sender, req.body.members],
  //   });
  //   if (findDuplication.length) {
  //     errors.duplication = "a conversation between these participants already exists";
  //   }
  // }
  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
