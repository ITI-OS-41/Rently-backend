const {
  userIdCheck,
  itemIdCheck,
  categoryIdCheck,
  subCategoryIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");
const Item = require("../models/Item");
const Category = require("../models/Category");

module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Item.requiredFields();
  const requestBody = Object.keys(data);

  const idItemCheck = await itemIdCheck(id, res);
  if (Object.keys(idItemCheck).length > 0) {
    return res.status(404).json(idItemCheck);
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  const idCategoryCheck = await categoryIdCheck(data.category, res);
  if (Object.keys(idCategoryCheck).length > 0) {
    errors.category = idCategoryCheck;
  } else {
    const modelCheck = await Category.findById(data.category);
    if (modelCheck) {
      if (modelCheck.model !== "item") {
        errors.category = "provided category is not of type item";
      }
    }
  }

  const idSubCategoryCheck = await subCategoryIdCheck(data.subcategory, res);
  if (Object.keys(idSubCategoryCheck).length > 0) {
    errors.subCategory = idSubCategoryCheck;
  }

  const idUserCheck = await userIdCheck(data.owner, res);
  if (Object.keys(idUserCheck).length > 0) {
    errors.owner = idUserCheck;
  }

  const condition = ["perfect", "very good", "descent", "good", "fair"];
  if (!errors.condition && !condition.includes(data.condition)) {
    errors.condition = `${data.condition} is not an accepted value for condition`;
  }

  const cancellation = ["easygoing", "reasonable", "strict"];
  if (!errors.cancellation && !cancellation.includes(data.cancellation)) {
    errors.cancellation = `${data.cancellation} is not an accepted value for cancellation`;
  }
  if (!data.price) {
    errors.price = "price is required";
  } else if (typeof data.price != "object") {
    errors.price = "price should be determined as per day/week/month";
  } else {
    if (
      data.price &&
      Object.keys(data.price).length !== 0 &&
      data.price.constructor === Object
    ) {
      if (!data["price"].day && !data["price"].week && !data["price"].month) {
        errors.price = "determine price per day/week/month";
      } else {
        if (
          (data.price.day && isNaN(data.price.day)) ||
          (data.price.week && isNaN(data.price.week)) ||
          (data.price.month && isNaN(data.price.month))
        ) {
          errors.price = "item price should be a number";
        } else if (
          data.price.day < 0 ||
          data.price.week < 0 ||
          data.price.month < 0
        ) {
          errors.price = "item price is invalid";
        }
      }
    } else {
      errors.price = "item price is empty";
    }
  }

  if (!errors.stock) {
    if (data.stock <= 0 || isNaN(data.stock)) {
      errors.stock = "item stock is invalid";
    }
  }
  if (!errors.deposit) {
    if (data.deposit <= 0 || isNaN(data.deposit)) {
      errors.deposit = "item deposit is invalid";
    }
  }

  if (
    !errors.isDeliverable &&
    data.isDeliverable.toString().trim() !== "true" &&
    data.isDeliverable.toString().trim() !== "false"
  ) {
    errors.isDeliverable = "item delivery status should be a true false value";
  }

  if (
    !errors.isSubmitted &&
    data.isSubmitted.toString().trim() !== "true" &&
    data.isSubmitted.toString().trim() !== "false"
  ) {
    errors.isSubmitted = "item submission status should be a true false value";
  }

  if (
    !errors.isAvailable &&
    data.isAvailable.toString().trim() !== "true" &&
    data.isAvailable.toString().trim() !== "false"
  ) {
    errors.isAvailable = "item availablility should be a true false value";
  }
  if (
    !errors.isPublished &&
    data.isPublished.toString().trim() !== "true" &&
    data.isPublished.toString().trim() !== "false"
  ) {
    errors.isPublished = "item publish status should be a true false value";
  }

  if (!data.location) {
    errors.location = "location is required";
  } else if (data.location.constructor !== Object) {
    errors.location = "location type is invalid";
  } else {
    if (Object.keys(data.location).length !== 0) {
      if (data.location.coordinates) {
        if (
          data.location.coordinates.length !== 2 ||
          data.location.coordinates.constructor !== Array
        ) {
          errors.location = "item location coordinates are invalid";
        } else {
          for (let i = 0; i < data.location.coordinates.length; i++) {
            if (isNaN(data.location.coordinates[i])) {
              // or use this alternative typeof arr[i]  == 'number'}
              errors.location = "item location coordinates should be numbers";
            }
          }
        }
      } else {
        errors.location = "item location coordinates are required";
      }
    } else {
      errors.location = "item location is empty";
    }
  }

  if (!data.photo) {
    errors.photo = "photo is required";
  } else if (data.photo.constructor !== Array) {
    errors.photo = "photo should be an array of strings";
  } else {
    if (data.photo.length === 0) {
      errors.photo = "item photo is empty";
    } else {
      for (let i = 0; i < data.photo.length; i++) {
        if (typeof data.photo[i] !== "string") {
          // or use this alternative typeof arr[i]  == 'number'}
          errors.photo = "item photo data should be string";
        }
      }
    }
  }

  if (Object.keys(errors).length == 0) {
    const includeSubCheck = await Category.find({ _id: data.category });
    if (includeSubCheck.length === 1) {
      if (includeSubCheck[0].subcategory.indexOf(data.subcategory) === -1) {
        errors.subCategory =
          "subset error, the provided SubCategory is not part of the provided Category";
      }
    }
  }

  if (Object.keys(errors).length == 0) {
    const duplicationCheck = await Item.find({
      name: data.name,
      owner: req.user.id,
    });
    if (duplicationCheck.length) {
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "an item with this name has been published by the same owner, please choose another name";
        }
      } else {
        errors.duplication =
          "an item with this name has been published by the same owner, please choose another name";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
