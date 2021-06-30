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
const AppRate = require("../models/AppRate");
const UserRate = require("../models/UserRate");
const Rent = require("../models/Rent");
const ItemRate = require("../models/ItemRate");

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

const cartIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "this is not a valid cart id";
    } else {
      const idCheck = await AppRate.findById(id);
      if (!idCheck) {
        errors.id = " cart not found";
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
const itemRateIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid itemRate id";
    } else {
      const idCheck = await ItemRate.findById(id);
      if (!idCheck) {
        errors.id = "itemRate not found ";
      }
    }
  }
  return errors;
};

const userRateIdCheck = async (id, res) => {
  let errors = {};
  if (id) {
    if (!validator.isMongoId(id)) {
      errors.id = "invalid userRate id";
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

module.exports = {
  missingFieldsChecker,
  catchErrors,
  validateId,
  cartIdCheck,
  conversationIdCheck,
  userRateIdCheck,
  itemRateIdCheck,
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
};
