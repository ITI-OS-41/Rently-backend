/** @format */

const mongoose = require('mongoose');
const { QUESTION  } = require('../helpers/errors');
const FAQ = require('../models/FAQ');

exports.create = async (req, res) => {
	const question = await new FAQ(req.body).save();
	console.log(question);
	res.status(200).send(question);
};

exports.getOne = (req, res) => {
	const Id = req.params.id;
	FAQ.findOne({ _id: req.params.id })
		.then((question) => {
			if (question) {
				return res.json(question);
			} else {
				return res.status(404).json({ msg: QUESTION.notFound });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ msg: QUESTION.invalidId });
		});
};

exports.getAll = async (req, res) => {
	let { _id, slug } = req.query;
	console.log(req.query);
	const queryObj = {
		...(_id && { _id }),
		...(slug && { slug }),
	};
	await FAQ.find(queryObj).then((objects) => {
		res.status(200).send(objects);
	});
};

exports.update = async (req, res) => {
	await FAQ.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	})
		.then((response) => {
			res.status(200).send(response);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send({ msg: QUESTION.invalidId });
		});
};

exports.deleteOne = async (req, res) => {
	FAQ.findById(req.params.id)
		.then((question) => {
			if (question) {
				question.remove().then(() => {
					return res.status(200).send(question);
				});
			} else {
				return res.status(404).json({ msg: QUESTION.notFound });
			}
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send({ msg: QUESTION.invalidId });
		});
};
