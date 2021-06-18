const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const Category = mongoose.model("Category");

// * Create and Save a new Category
exports.create = async (req, res) => {
	req.body.createdBy = req.user.id;
    const category = await new Category(req.body).save();
    res.status(201).send(category);
};

//* Get One
exports.getOne = (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
	Category.findById(id)
		.then((category) => {
			if (category) {
				return res.json(category);
			} else {
				return res.status(404).json({ msg: error  });
			}
		})
	}
};

//* Get ALL
exports.getAll = async (req, res) => {
	let { _id } = req.query;
	const queryObj = {
		...(_id && { _id }),
	};
	await Category.find(queryObj).then((objects) => {
		res.status(200).send(objects);
	});
};

exports.update = async (req, res) => {
	await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	})
		.then((response) => {
			res.status(200).send(response);
		})
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
	Category.findById(id)
		.then((category) => {
			if (category) {
				category.remove().then(() => {
					return res.status(200).send(category);
				});
			} else {
				return res.status(404).json({ msg:error });
			}
		})
	}
};

