/** @format */

const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const UserRate = mongoose.model("UserRate");

exports.create = async (req, res) => {
	const userRate = await new UserRate(req.body).save();
	res.status(200).send(userRate);
};

exports.getOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id)) {
		await UserRate.findById(id).then((blogPost) => {
			if (blogPost) {
				return res.json(blogPost);
			} else {
				return res.status(404).json({ msg: "rate not found" });
			}
		});
	}
};

exports.getAll = async (req, res) => {
	const sortBy = req.query.sortBy || "createdAt";
	const orderBy = req.query.orderBy || "asc";
	const sortQuery = {
		[sortBy]: orderBy,
	};

	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const skip = page * limit - limit;
	let { rating } = req.query;

	const queryObj = {
		...(rating && { rating }),
	};

	await UserRate.find(queryObj)
		.limit(limit)
		.skip(skip)
		.sort(sortQuery)
		.then((objects) => {
			res.status(200).send(objects);
		});
};

exports.update = async (req, res) => {
	await UserRate.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	})
		.select({ owner: 0, renter: 0 })
		.then((response) => {
			res.status(200).send(response);
		});
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id)) {
		UserRate.findById(req.params.id).then((userRate) => {
			if (userRate) {
				userRate.remove().then(() => {
					return res.status(200).send(userRate);
				});
			} else {
				return res.status(404).json({ msg: "rate not found" });
			}
		});
	}
};
