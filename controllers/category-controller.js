const Category = require('../models/Category');
// * Create and Save a new Category
exports.create = async (req, res) => {
	req.body.createdBy= req.user.id
    const category = await new Category(req.body).save();

    res.status(201).send(category);

};


//* Get One
exports.getOne = (req, res) => {
	const Id = req.params.id;
	Category.findOne({ _id: req.params.id })
		.then((category) => {
			if (category) {
				return res.json(category);
			} else {
				return res.status(404).json({ msg: error  });
			}
		})
		.catch((err) => {
			return res.status(500).json({ msg: err});
		});
};

//* Get ALL
exports.getAll = async (req, res) => {
	let { model } = req.query;
	const queryObj = {
    ...(model && { model }),
  };
	await Category.find(queryObj).then((objects) => {
		res.status(200).send(objects);
	});
};

exports.update = async (req, res) => {
	await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	})
		.then((response) => {
			res.status(200).send(response);
		})
		.catch((error) => {
			return res.status(500).send({message: error });
		});
};

exports.deleteOne = async (req, res) => {
	Category.findById(req.params.id)
		.then((category) => {
			if (category) {
				category.remove().then(() => {
					return res.status(200).send(category);
				});
			} else {
				return res.status(404).json({ msg:error });
			}
		})
		.catch((error) => {
	
			return res.status(500).send({ msg: error });
		});
};

