const Validator = require("validator");

const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((next) => {
      console.log("fd", next);
      return res.status(500).send({ msg: next.message });
    });
  };
};

function validateId(id, res) {
  if (!Validator.isMongoId(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }
}

// check if required fields is not in request body
const missingFieldsChecker = (arr, required) => {
  let missings = [];
  for (let i = 0; i < required.length; i++) {
    let found = arr.includes(required[i]);
    if (found === false) {
      missings.push(required[i]);
    }
  }
  return missings;
};

const assignErrorsToMissingFields = (missingFields) => {
  let errors = {};
  if (missingFields.length) {
    missingFields.map((err) => {
      errors[err] = `${err} is required`;
    });
  }
  return errors;
};

const assignEmptyErrorsToFields = (data, fields) => {
  let errors = {};

  if (fields) {
    fields.forEach((field) => {
      if (!data[field].length) {
        errors[field] = `${field} is empty`;
      }
    });
  }
  return errors;
};

const getTwoArraysDifferences = (arr1, arr2) => {
  return arr1.filter((x) => arr2.indexOf(x) === -1);
};

const EMAIL = {
  required: "Email Address is required!",
  invalid: "Invalid Email Address",
  duplicate: "Email was already used before!",
};
const USERNAME = {
  required: "Username is required!",
};
const USER = {
  notFound: "User not found!",
  invalidId: "Invalid ID!",
};
const PASSWORD = {
  required: "Password is required!",
  criteria: "password must be between 6 to 30",
};

const NOTIFICATION = {
  invalid: "Notification ID is required!",
  notFound: "Notification not found!",
};
const QUESTION = {
  notFound: "question not found",
  invalidId: "page not found",
};
const ID = {
  invalid: "Invalid ID!",
};

const BLOG_POST = {
  notFound: "Post not found",
  invalidId: "Invalid ID",
};
const SLUG = {
  notFound: "title not found",
  invalidSlug: "invalid slug",
};
const RENT = {
  invalid: "Rent ID is required!",
  notFound: "Rent not found!",
};

const ITEMRATE = {
  notFound: "itemRate ID is required!",
  invalidId: "Invalid ID!",
  badRequest: "I have made a bad request",
};

const APPRATE = {
  notFound: "appRate ID is required!",
  invalidId: "Invalid ID!",
  badRequest: "I have made a bad request",
};

const USERRATE = {
  notFound: "userRate ID is required!",
  invalidId: "Invalid ID!",
  badRequest: "I have made a bad request",
};

module.exports= {
  missingFieldsChecker,
  catchErrors,
  validateId,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  assignEmptyErrorsToFields,
  EMAIL,
  USERNAME,
  USER,
  PASSWORD,
  BLOG_POST,
  SLUG,
  NOTIFICATION,
  ID,
  RENT,
  QUESTION,
  ITEMRATE,
  APPRATE,
  USERRATE
};
