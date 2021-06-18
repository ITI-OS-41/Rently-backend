/** @format */

const {
	assignEmptyErrorsToFields,
	assignErrorsToMissingFields,
	getTwoArraysDifferences,
	missingFieldsChecker,
} = require("../helpers/errors");
const validator = require("validator");
const Blog = require("../models/Blog");

module.exports = async (req, res, next) => {
	let errors = {};
	const id = req.params.id;
	const data = req.body;
	const requiredFields = Blog.requiredFields();
	const requestBody = Object.keys(data);
	if (id) {
		if (!validator.isMongoId(id)) {
			errors.id = "invalid id";
			return res.status(404).json(errors);
		} else {
			const idCheck = await Blog.findById(id);
			if (!idCheck) {
				errors.id = "post not found";
				return res.status(404).json(errors);
			}
		}
	}

	let missingFields = missingFieldsChecker(requestBody, requiredFields);

	errors = assignErrorsToMissingFields(missingFields);

	let difference = getTwoArraysDifferences(requiredFields, missingFields);

	errors = {
		...errors,
		...assignEmptyErrorsToFields(data, difference),
	};

	if (
		data.title &&
		!validator.isLength(data.title, { min: 4 }) &&
		!errors.title
	) {
		errors.title = `title ${data.title} is shorter than the minimum allowed length (4)`;
	}

	if (Object.keys(errors).length > 0) {
		// console.log(data, errors);
		return res.status(404).json(errors);
	} else {
		return next();
	}
};
