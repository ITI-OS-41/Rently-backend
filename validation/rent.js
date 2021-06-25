/** @format */
const {
  rentIdCheck,
  userIdCheck,
  itemIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Item = require("../models/Item");
const validator = require("validator");
const Rent = require("../models/Rent");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Rent.requiredFields();
  const requestBody = Object.keys(data);
  const from = new Date(data.from).getTime();
  const to = new Date(data.to).getTime();
  const status = ["pending", "approved", "delivered", "returned", "declined"];

  const idRentCheck = await rentIdCheck(id, res);
  if (Object.keys(idRentCheck).length > 0) {
    return res.status(404).json(idRentCheck);
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

  const idOwnerCheck = await userIdCheck(data.owner, res);
  if (Object.keys(idOwnerCheck).length > 0) {
    errors.owner = idOwnerCheck;
  }

  if (data.owner == req.user.id) {
    errors.owner =
      "you can't be the owner and the renter at the same operation";
  }

  if (!errors.item) {
    const item = await Item.findById(data.item);
    if (item.stock === 0) {
      errors.item = "this item is out of stock";
    }
  }

  // from should be before to
  // if(!errors.to && !validator.isDate(data.to)){
  //   console.log("elhamd wlshokr leek")
  // }

  if (from > to) {
    errors.time = "start date should be before end date";
  }

  if (!errors.insurance) {
    if (data.insurance < 1 || isNaN(data.insurance)) {
      errors.insurance = "item insurance is invalid";
    }
  }

  if (!errors.totalPrice) {
    if (data.totalPrice < 1 || isNaN(data.totalPrice)) {
      errors.totalPrice = "item totalPrice is invalid";
    }
  }

  // Status check validation
  if (id) {
    if (!errors.status && !status.includes(data.status)) {
      errors.status = `${data.status} is not an accepted value for status`;
    }
  } else if (!errors.status && data.status !== "pending") {
    errors.status = `${data.status} is not an accepted value for making a rent`;
  }

  if (Object.keys(errors).length === 0) {
    const verifiedRents = await Rent.find({
      renter: req.user.id,
      item: data.item,
      owner: data.owner,
    });

    if (verifiedRents.length) {
      verifiedRents.forEach((rent) => {
        if (rent.status !== "returned") {
          errors.owner =
            "you can't request another rent from the item owner on this item, while ongoing renting between both on the same item";
        }
      });
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
