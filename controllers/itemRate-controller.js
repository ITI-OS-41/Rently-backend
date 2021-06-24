/** @format */
const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const ItemRate = require("../models/ItemRate");
const Item = require("../models/Item");

exports.create = async (req, res) => {
	req.body.rater = req.user.id;
	req.body.item = req.params.id;
	console.log(req.params);
	const itemRate = await new ItemRate(req.body).save();
	await Item.updateMany(
		{ _id: itemRate.item },
		{ $push: { itemRate: itemRate._id } }
	);
	res.status(200).send(itemRate);
};

exports.getOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id)) {
		await ItemRate.findById(id).then((itemRate) => {
			if (itemRate) {
				return res.json(itemRate);
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
	await ItemRate.find(queryObj)
		.limit(limit)
		.skip(skip)
		.sort(sortQuery)
		.then((objects) => {
			res.status(200).send(objects);
		});
};

exports.update = async (req, res) => {
	await ItemRate.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	}).then((response) => {
		res.status(200).send(response);
	});
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id)) {
		ItemRate.findById(req.params.id).then((itemRate) => {
			if (itemRate) {
				itemRate.remove().then(() => {
					return res.status(200).send(itemRate);
				});
			} else {
				return res.status(404).json({ msg: "rate not found" });
			}
		});
	}
};
