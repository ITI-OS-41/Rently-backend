const Category = require('../models/Category');
// Create and Save a new Category
exports.create = async (req, res) => {
    // console.log(";;;;");

    // Category.name = req.body.name;
    // Category.description = req.body.description;
    const category = await new Category(req.body).save();
    // console.log("jjjjjjjjjj");
    // Category.save(function (error) {
    //     if (error)
    //         res.send("Error", error)
    //     res.status(201).json({ message: 'err' });
    // })
    res.status(201).send(category);

};



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
			console.log(err);
			return res.status(500).json({ msg: err});
		});
};


