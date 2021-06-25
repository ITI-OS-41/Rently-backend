/** @format */

const validator = require("validator");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Faq = require("../models/Faq");
const Item = require("../models/Item");
const AppRate= require("../models/AppRate")
const UserRate = require("../models/UserRate");
const Rent = require("../models/Rent");

const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((next) => {
      console.log("fd", next);
      return res.status(500).send({ msg: next.message });
    });
  };
};
const appRateIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "this is not a valid appRate id";
    } else {
      const idCheck = await AppRate.findById(id);
      if (!idCheck) {
        errors.id = " appRate not found";
      }
    }
  }
  return errors;
};

const rentIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "this is not a valid rent id";
    } else {
      const idCheck = await Rent.findById(id);
      if (!idCheck) {
        errors.id = " rent not found";
      }
    }
  }
  return errors;
};

const userIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid user id";
    } else {
      const idCheck = await User.findById(id);
      if (!idCheck) {
        errors.id = "user not found ";
      }
    }
  }
  return errors;
};

const userRateIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid user id";
    } else {
      const idCheck = await UserRate.findById(id);
      if (!idCheck) {
        errors.id = "userRate not found ";
      }
    }
  }
  return errors;
};

const faqIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid faq id";
    } else {
      const idCheck = await Faq.findById(id);
      if (!idCheck) {
        errors.id = "faq not found";
      }
    }
  }
  return errors;
};
const conversationIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid conversation id";
    } else {
      const idCheck = await Conversation.findById(id);
      if (!idCheck) {
        errors.id = "conversation not found";
      }
    }
  }
  return errors;
};

const subCategoryIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid subCategory id";
    } else {
      const idCheck = await SubCategory.findById(id);
      if (!idCheck) {
        errors.id = "subCategory not found";
      }
    }
  }
  return errors;
};

const categoryIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid category id";
    } else {
      const idCheck = await Category.findById(id);
      if (!idCheck) {
        errors.id = "category not found";
      }
    }
  }
  return errors;
};

const blogIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid blog id";
    } else {
      const idCheck = await Blog.findById(id);
      if (!idCheck) {
        errors.id = "blog not found";
      }
    }
  }
  return errors;
};

const commentIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid comment id";
    } else {
      const idCheck = await Comment.findById(id);
      if (!idCheck) {
        errors.id = "comment not found";
      }
    }
  }
  return errors;
};

const itemIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid item id";
    } else {
      const idCheck = await Item.findById(id);
      if (!idCheck) {
        errors.id = "item not found";
      }
    }
  }
  return errors;
};
const validateId = (id) => {
  let errors = {};
  if (!validator.isMongoId(id)) {
    return (errors.id = "invalid id");
  }
};

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
      errors[err] = `${err} field is required`;
    });
  }
  return errors;
};

const assignEmptyErrorsToFields = (data, fields) => {
  let errors = {};

  if (fields) {
    fields.forEach((field) => {
      if (data[field] == null) {
        errors[field] = `${field} field can't be null`;
      } else if (
        typeof data[field] != "number" &&
        typeof data[field] != "boolean" &&
        typeof data[field] != "object"
      ) {
        if (!data[field].trim().length) {
          errors[field] = `${field} field is empty`;
        }
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

module.exports = {
  missingFieldsChecker,
  catchErrors,
  validateId,
  conversationIdCheck,
  userRateIdCheck,
  itemIdCheck,
  appRateIdCheck,
  faqIdCheck,
  userIdCheck,
  rentIdCheck,
  categoryIdCheck,
  blogIdCheck,
  subCategoryIdCheck,
  commentIdCheck,
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
  USERRATE,
};
