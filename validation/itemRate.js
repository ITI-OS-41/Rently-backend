const Validator = require("validator");
import User from "../models/User";
import Item from "../models/Item"
import ItemRate from "../models/ItemRate"

module.exports = async function (data) {
  let errors = {};


  if (Validator.isEmpty(data.rater)) {
    errors.rater = "rater is required";
  } 

  // refactor, usercheck middleware

  if (!Validator.isMongoId(data.rater)) {
    errors.rater = "this is not valid user id"
  }
    else {
      const rater = await User.findById(data.rater);
  if (!rater) {
    errors.rater = "this rater is not found in our database ";
  }
    }

  if (Validator.isEmpty(data.item)) {
    errors.item = "item is required";
  }

  if (!Validator.isMongoId(data.item)) {
    errors.item = "this is not valid item id"
  }
    else {
      const item = await Item.findById(data.item);
  if (!item) {
    errors.item = "this item is not found in our database ";
  }
    }


const duplicationCheck= await ItemRate.find({item:data.item, rater:data.rater})
if(duplicationCheck.length>0){
 errors.duplication="you can't rate the same item more than one time"
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
