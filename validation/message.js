/** @format */

const {
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
  conversationIdCheck,
} = require("../helpers/errors");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
module.exports = async (req, res, next) => {
  let errors = {};
  const data = req.body;
  const requiredFields = Message.requiredFields();
  const requestBody = Object.keys(data);

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };
  if (!errors.conversationId) {
    const idCheck = await conversationIdCheck(req.body.conversationId, res);
    if (Object.keys(idCheck).length > 0) {
      return res.status(404).json(idCheck);
    } else {
      const checkSender = await Conversation.find({
        _id: req.body.conversationId,
        members: { $in: [data.sender] },
      });
      if (!checkSender.length) {
        errors.authorization =
          "sender is not part of the requested conversation ";
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
