const SubCategory = require('../models/SubCategory');
// * Create and Save a new Category
exports.create = async (req, res) => {

	const subCategory = await new SubCategory(req.body).save();

	res.status(201).send(subCategory);

};

//* Get One
exports.getOne = (req, res) => {
	const Id = req.params.id;
	SubCategory.findOne({ _id: req.params.id })
		.then((subCategory) => {
			if (subCategory) {
				return res.json(subCategory);
			} else {
				return res.status(404).json({ msg: error });
			}
		})
		.catch((err) => {
			return res.status(500).json({ msg: err });
		});
};

//* Get ALL
exports.getAll = async (req, res) => {
	let { _id, category } = req.query;
	const queryObj = {
		...(_id && { _id }),
		...(category && { category }),
	};
	await SubCategory.find(queryObj).then((objects) => {
		res.status(200).send(objects);
	});
};

exports.update = async (req, res) => {
	await SubCategory.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	})
		.then((response) => {
			res.status(200).send(response);
		})
		.catch((error) => {
			return res.status(500).send({ message: error });
		});
};

exports.deleteOne = async (req, res) => {
	SubCategory.findById(req.params.id)
		.then((subCategory) => {
			if (subCategory) {
				subCategory.remove().then(() => {
					return res.status(200).send(subCategory);
				});
			} else {
				return res.status(404).json({ msg: error });
			}
		})
		.catch((error) => {

			return res.status(500).send({ msg: error });
		});
};

