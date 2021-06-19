const ItemRate = require("../models/ItemRate");
const { ITEMRATE, ID } = require("../helpers/errors");
const ObjectId = require("mongoose").Types.ObjectId;

const validateItemRate = require("../validation/itemRate");
const itemRate = require("../validation/itemRate");

exports.create = async (req, res) => {
  req.body.rater = req.user.id;
  req.body.item = req.params.id;
  console.log(req.params)
	const itemRate = await new ItemRate(req.body).save();
	res.status(200).send(itemRate);
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

exports.getOne = (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  ItemRate.findById(id)
    .then((itemRate) => {
      if (itemRate) {
        return res.json({
          _id: itemRate._id,
          item: itemRate.item,
          rater: itemRate.rater,
          rating: itemRate.rating,
          comment: itemRate.comment,
        });
      } else {
        return res.status(404).json({ msg: ITEMRATE.notFound });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: ITEMRATE.invalidId });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  const { isValid, errors } = await validateItemRate(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }
  await ItemRate.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .select({ item: 0, rater: 0 })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: error.message });
    });
};

exports.deleteOne = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  ItemRate.findById(req.params.id)
    .then((itemRate) => {
      if (itemRate) {
        itemRate.remove().then(() => {
          return res.status(200).send(itemRate);
        });
      } else {
        return res.status(404).json({ msg: ITEMRATE.notFound });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: ITEMRATE.notFound });
    });
};
