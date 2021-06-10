const Validator = require("validator");
import User from "../models/User";
import UserRate from "../models/UserRate";
import Item from "../models/Item";
import Rent from "../models/Rent";

module.exports = async function (data) {
  let errors = {};

  if (Validator.isEmpty(data.item)) {
    errors.item = "item id is required";
  }


  if (!Validator.isMongoId(data.item)) {
    errors.item = "this is not valid item id";
  } else {
    const item = await Item.findById(data.item);
    if (!item) {
      errors.item = "this item is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.renter)) {
    errors.renter = "renter id is required";
  }

  // refactor, usercheck middleware

  if (Validator.isEmpty(data.renter)) {
    errors.renter = "renter id is required";
  }

  if (!Validator.isMongoId(data.renter)) {
    errors.renter = "this is not valid user id";
  } else {
    const renter = await User.findById(data.renter);
    if (!renter) {
      errors.renter = "this user is not found in our database ";
    }
  }

  if (Validator.isEmpty(data.owner)) {
    errors.owner = "owner id is required";
  }

  if (!Validator.isMongoId(data.owner)) {
    errors.owner = "this is not valid owner id";
  } else {
    const owner = await User.findById(data.owner);
    if (!owner) {
      errors.owner = "this user is not found in our database ";
    }
  }

  const duplicationCheck = await UserRate.find({
    owner: data.owner,
    renter: data.renter,
    item: data.item
  });
  if (duplicationCheck.length) {
    errors.duplication =
      "you can't rate the same user more than one time for the same item, please update your review instead";
  }

  if (data.renter === data.owner) {
    errors.renter = "you can't rate yourself";
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


    //check renter if he rented an item from the owner


  const renterRatingCheck = await Rent.find({
    owner: data.owner,
    renter: data.renter,
    item: data.item
  });

  if (renterRatingCheck.length) {

    renterRatingCheck.forEach(rating => {

      if (rating.status !== "returned") {
        errors.renterRating =
          "the renting process should end before submitting a review for the renter";
      }
    });
    
    
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
