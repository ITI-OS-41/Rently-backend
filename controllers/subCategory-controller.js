const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
// * Create and Save a new Category
exports.create = async (req, res) => {
	req.body.createdBy= req.user.id
	const subCategory = await new SubCategory(req.body).save();
  await Category.updateMany(
    { _id: subCategory.category },
    { $push: { subcategory: subCategory._id } }
  );

	res.status(200).send(subCategory);

};

//* Get One
exports.getOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		await SubCategory.findById(id).then((subCategory) => {
			if (subCategory) {
				return res.json(subCategory);
			} else {
				return res.status(404).json({ msg: "post not found" });
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
	let { name } = req.query;

	const queryObj = {
		...(name && { name: new RegExp(`${name}`) }),
	};

	await SubCategory.find(queryObj)
		.limit(limit)
		.skip(skip)
		.sort(sortQuery)
		.then((objects) => {
			res.status(200).send(objects);
		});
};

exports.update = async (req, res) => {
	await SubCategory.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	}).then((response) => {
		res.status(200).send(response);
	});
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		SubCategory.findById(req.params.id).then((subCategory) => {
			if (subCategory) {
				subCategory.remove().then(() => {
					return res.status(200).send(subCategory);
				});
			} else {
				return res.status(404).json({ msg: "sub category not found" });
			}
		});
	}
};
