/** @format */

const {
	assignEmptyErrorsToFields,
	assignErrorsToMissingFields,
	getTwoArraysDifferences,
	missingFieldsChecker,
} = require("../helpers/errors");

const userRate = require("../models/UserRate");
module.exports = async (req, res, next) => {
	let errors = {};
	const data = req.body;
	const requiredFields = userRate.requiredFields();
	const requestBody = Object.keys(data);

	let missingFields = missingFieldsChecker(requestBody, requiredFields);

	errors = assignErrorsToMissingFields(missingFields);

	let difference = getTwoArraysDifferences(requiredFields, missingFields);
	const duplicationCheck = await UserRate.find({
		rater: data.rater,
		owner: data.owner,
	});
	if (duplicationCheck.length) {
		errors.duplication =
			"you can't rate the user twice";
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
