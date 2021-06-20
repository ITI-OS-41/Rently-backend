/** @format */

const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const Category = mongoose.model("Category");

// * Create and Save a new Category
exports.create = async (req, res) => {
	req.body.createdBy = req.user.id;
	const category = await new Category(req.body).save();
	res.status(200).send(category);
};

//* Get One
exports.getOne = (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		Category.findById(id).then((category) => {
			if (category) {
				return res.json(category);
			} else {
				return res.status(404).json({ msg: error });
			}
		});
	}
};

//* Get ALL
exports.getAll = async (req, res) => {
	const sortBy = req.query.sortBy || "createdAt";
	const orderBy = req.query.orderBy || "asc";
	const sortQuery = {
		[sortBy]: orderBy,
	};

	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const skip = page * limit - limit;
	let { name, subcategory } = req.query;
	const queryObj = {
		...(name && { name: new RegExp(`${name}`) }),
		...(subcategory && {
			subcategory: new RegExp(subcategory.replace(/,/g, "|")),
		}),
		
	};
	const getCategories = await Category.find(queryObj)
		.limit(limit)
		.skip(skip)
		.sort(sortQuery);
	res.status(200).send(getCategories);
};

exports.update = async (req, res) => {
	await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	}).then((response) => {
		res.status(200).send(response);
	});
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		Category.findById(id).then((category) => {
			if (category) {
				category.remove().then(() => {
					return res.status(200).send(category);
				});
			} else {
				return res.status(404).json({ msg: error });
			}
		});
	}
};
