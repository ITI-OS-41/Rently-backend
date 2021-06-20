const AppRate = require("../models/AppRate");
const { APPRATE, ID } = require("../helpers/errors");
const ObjectId = require("mongoose").Types.ObjectId;

const validateAppRate = require("../validation/appRate");

exports.create = async (req, res) => {
  const { isValid, errors } = await validateAppRate(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }

  const appRate = new AppRate({
    ...req.body,
  });

  await appRate
    .save()
    .then((appRate) => {
      res.json({ appRate });
    })
    .catch((err) => {
      return res.status(500).send({ msg: APPRATE.badRequest });
    });
};

exports.getAll = async (req, res) => {
  let { _id, site, rater } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(site && { site }),
    ...(rater && { rater }),
  };

  await AppRate.find(queryObj).then((objects) => {
    res.status(200).send(objects);
  });
};

exports.getOne = (req, res) => {
  const Id = req.params.id;

  AppRate.findById(Id)
    .then((appRate) => {
      if (appRate) {
        return res.json({
          _id: appRate._id,
          site: appRate.site,
          rater: appRate.rater,
          rating: appRate.rating,
          comment: appRate.comment,
        });
      } else {
        return res.status(404).json({ msg: APPRATE.notFound });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: APPRATE.invalidId });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  const { isValid, errors } = await validateAppRate(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }
  await AppRate.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .select({ site: 0, rater: 0 })
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

  AppRate.findById(req.params.id)
    .then((appRate) => {
      if (appRate) {
        appRate.remove().then(() => {
          return res.status(200).send(appRate);
        });
      } else {
        return res.status(404).json({ msg: APPRATE.notFound });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: APPRATE.notFound });
    });
};
