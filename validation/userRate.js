/** @format */

const {
  userRateIdCheck,
  itemIdCheck,
  userIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Rent = require("../models/Rent");
const UserRate = require("../models/UserRate");
module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = UserRate.requiredFields();
  const requestBody = Object.keys(data);

  const idUserRateCheck = await userRateIdCheck(id, res);
  if (Object.keys(idUserRateCheck).length > 0) {
    return res.status(404).json(idUserRateCheck);
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  const idUserCheck = await userIdCheck(data.renter, res);
  if (Object.keys(idUserCheck).length > 0) {
    errors.renter = idUserCheck;
  }
  
  const idItemCheck = await itemIdCheck(data.item, res);
  if (Object.keys(idItemCheck).length > 0) {
    errors.item = idItemCheck;
  }
  if (!errors.rating) {
    if (!isNaN(data.rating)) {
      if (data.rating > 5 || data.rating < 1) {
        errors.rating = "rating  must be between 1 to 5";
      }
    } else {
      errors.rating = "rating should be a number value";
    }
  }
  if (Object.keys(errors).length === 0) {
    const verifiedRents = await Rent.find({
      owner: req.user.id,
      item: data.item,
      renter: data.renter,
    });

    if (verifiedRents.length) {
      verifiedRents.forEach((rent) => {
        if (rent.status !== "returned") {
          errors.owner =
            "the renting process should be returned before submitting a review for the renter";
        }
      });
    } else {
      errors.owner =
        "there is no renting between the provided renter and owner for this item";
    }
  }

  if (Object.keys(errors).length === 0) {
    const duplicationCheck = await UserRate.find({
      owner: req.user.id,
      item: data.item,
      renter: data.renter,
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
