/** @format */
const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const ItemRate = mongoose.model("ItemRate");

exports.create = async (req, res) => {
	req.body.rater = req.user.id;
	req.body.item = req.params.id;
	console.log(req.params);
	const itemRate = await new ItemRate(req.body).save();
	res.status(200).send(itemRate);
};

exports.getOne = (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
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
	let { _id, item, rater, rating } = req.query;
	const queryObj = {
		...(_id && { _id }),
		...(item && { item }),
		...(rater && { rater }),
		...(rating && { rating }),
	};

	await ItemRate.find(queryObj).then((objects) => {
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
	if (!validateId(id, res)) {
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
