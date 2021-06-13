/** @format */

import Blog from "../models/Blog";
import User from "../models/User";

// const {checker} = require ("../helpers/errors")

const Validator = require("validator");

module.exports = async (req, res, next) => {
  let errors = {};
  let data = req.body;
  const id = req.params.id;
  const requiredFields = Blog.requiredFields();
  const requestBody = Object.keys(data);
  let missingField = [];
  // check if required fields is not in request body

  const checker = (arr, required) => {
    for (let i = 0; i < required.length; i++) {
      let found = arr.includes(required[i]);
      if (found === false) {
        missingField.push(required[i]);
      }
    }
    return missingField;
  };

  checker(requestBody, requiredFields);

  if (missingField.length) {
    missingField.map((err) => {
      errors[err] = `${err} is required`;
    });
  }

  let difference = requiredFields.filter((x) => missingField.indexOf(x) === -1);
  if (difference) {
    difference.forEach((field) => {
      if (!data[field].length) {
        errors[field] = `${field} is empty`;
      }
    });
  }
  if (!errors["author"]) {
    if (Validator.isMongoId(data.author)) {
      const author = await User.findById(data.author);
      if (!author) {
        errors.author = "this author is not found";
      }
    } else {
      errors.author = "this is an invalid user id";
    }
  }

  if (Object.keys(errors).length > 0) {
    // console.log(data, errors);
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
