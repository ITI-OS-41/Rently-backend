/** @format */
const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const FAQ = mongoose.model("FAQ");

exports.create = async (req, res) => {
	const question = await new FAQ(req.body).save();
	res.status(200).send(question);
};

exports.getOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		await FAQ.findById(id).then((faq) => {
			if (faq) {
				return res.json(faq);
			} else {
				return res.status(404).json({ msg: "question not found" });
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

	let { title } = req.query;
	const queryObj = {
		...(title && { title: new RegExp(`${title}`) }),
	};
	const getFAQ = await FAQ.find(queryObj)
		.limit(limit)
		.skip(skip)
		.sort(sortQuery);
	res.status(200).send(getFAQ);
};

exports.update = async (req, res) => {
	await FAQ.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	}).then((response) => {
		res.status(200).send(response);
	});
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		Blog.findById(req.params.id).then((question) => {
			if (question) {
				question.remove().then(() => {
					return res.status(200).send(question);
				});
			} else {
				return res.status(404).json({ msg: "post not found" });
			}
		});
	}
};
