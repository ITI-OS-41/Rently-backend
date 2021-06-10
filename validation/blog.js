/** @format */

import Blog from '../models/Blog';
const Validator = require('validator');

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
		console.log(missingField.length);
		missingField.map((err, key) => {
			console.log(err, key);
			errors[err] = `${err} is required`;
		});
	} else if (data.author && !Validator.isMongoId(data.author)) {
		errors.author = 'this is not a valid author id';
	} else {
		const author = await Blog.findById(data.author);
		if (!author) {
			errors.author = 'this author is not found';
		}
	}

	if (Object.keys(errors).length > 0) {
		// console.log(data, errors);
		return res.status(404).json(errors);
	} else {
		return next();
	}
};
