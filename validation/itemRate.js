/** @format */

const {
  itemRateIdCheck,
  itemIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");

const ItemRate = require("../models/ItemRate");
const Rent = require("../models/Rent");
module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = ItemRate.requiredFields();
  const requestBody = Object.keys(data);

const idItemRateCheck = await itemRateIdCheck(id, res);
if (Object.keys(idItemRateCheck).length > 0) {
  return res.status(404).json(idItemRateCheck);
}


let missingFields = missingFieldsChecker(requestBody, requiredFields);

errors = assignErrorsToMissingFields(missingFields);

let difference = getTwoArraysDifferences(requiredFields, missingFields);

errors = {
  ...errors,
  ...assignEmptyErrorsToFields(data, difference),
};

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
      item: data.item,
      renter: req.user.id,
    });

    if (verifiedRents.length) {
      verifiedRents.forEach((rent) => {
        if (rent.status !== "returned") {
          errors.rater =
            "the renting process should be returned before submitting a review for the item";
        }
      });
    } else {
      errors.rater =
        "there is no renting between the provided rater and this item";
    }
  }

  
  if (Object.keys(errors).length === 0) {
    const duplicationCheck = await ItemRate.find({
      rater: req.user.id,
      item: data.item,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "you can't rate the same item more than one time, please update your review instead";
        }
      } else {
        errors.duplication =
          "you can't rate the same item more than one time, please update your review instead";

      }
    }
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
