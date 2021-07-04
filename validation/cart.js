const {
  userIdCheck,
  rentIdCheck,
  cartIdCheck,
  categoryIdCheck,
  subCategoryIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Cart = require("../models/Cart");
const Category = require("../models/Category");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Cart.requiredFields();
  const requestBody = Object.keys(data);

  const idCartCheck = await cartIdCheck(id, res);
  if (Object.keys(idCartCheck).length > 0) {
    return res.status(404).json(idCartCheck);
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  for (let i = 0; i < data.rent.length; i++) {
    const idRentCheck = await rentIdCheck(data.rent[i], res);
    if (Object.keys(idRentCheck).length > 0) {
       (errors.rent = "invalid rent id / rent not found");
       break;
     }
  }

  if (!errors.orderTotal) {
    if (data.orderTotal < 0 || isNaN(data.orderTotal)) {
      errors.orderTotal = "Cart orderTotal is invalid";
    }
  }

  if (Object.keys(errors).length == 0) {
    const duplicationCheck = await Rent.find({
      renter: req.user.id,
      rent: data.rent,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication = "rent status is not approved";
        }
      } else {
        errors.duplication = "rent status is not approved";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
