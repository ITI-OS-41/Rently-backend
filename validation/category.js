/** @format */

const {
	assignEmptyErrorsToFields,
	assignErrorsToMissingFields,
	getTwoArraysDifferences,
	missingFieldsChecker,
} = require("../helpers/errors");
const validator = require("validator");
const Category = require("../models/Category");

module.exports = async (req, res, next) => {
	let errors = {};
	const id = req.params.id;
	const data = req.body;
	const requiredFields = Category.requiredFields();
	const requestBody = Object.keys(data);
	if (id) {
		if (!validator.isMongoId(id)) {
			errors.id = "invalid id";
			return res.status(404).json(errors);
		} else {
			const idCheck = await Category.findById(id);
			if (!idCheck) {
				errors.id = "category not found";
				return res.status(404).json(errors);
			}
		}
	}

	let missingFields = missingFieldsChecker(requestBody, requiredFields);

	errors = assignErrorsToMissingFields(missingFields);

	let difference = getTwoArraysDifferences(requiredFields, missingFields);

	const duplicationCheck = await Category.find({
		name: data.name,
		model:data.model
	});

	if (duplicationCheck.length) {
		errors.duplication = "name must be unique";
	}

	errors = {
		...errors,
		...assignEmptyErrorsToFields(data, difference),
	};

	if (Object.keys(errors).length > 0) {
		// console.log(data, errors);
		return res.status(404).json(errors);
	} else {
		return next();
	}
};
