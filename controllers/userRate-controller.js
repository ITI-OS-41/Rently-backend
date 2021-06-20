const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const UserRate = mongoose.model("UserRate");

exports.create = async (req, res) => {
  const userRate = await new UserRate(req.body).save();
	res.status(200).send(userRate);
};

exports.getOne = (req, res) => {
  const id = req.params.id;
	if (!validateId(id, res)) {
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
  let { _id, owner, renter } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(owner && { owner }),
    ...(renter && { renter }),
  };

  await UserRate.find(queryObj).then((objects) => {
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
    })
};

exports.deleteOne = async (req, res) => {
  const id = req.params.id;
  if (!validateId(id, res)) {
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
  }

