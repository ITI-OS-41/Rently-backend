const AppRate = require("../models/AppRate");
const User = require("../models/User");
const { validateId } = require("../helpers/errors");

exports.createOneAppRate = async (req, res) => {
  req.body.rater = req.user.id;
  const appRate = await new AppRate(req.body);
  try {
    const savedAppRate = await appRate.save();
    if (savedAppRate) {
      return res.status(200).json(savedAppRate);
    } else {
      return res.status(404).json({ msg: "appRate not saved" });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.getOneAppRate = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid appRate id" });
  }
  try {
    const foundAppRate = await AppRate.findById(id);
    if (foundAppRate) {
      return res.status(200).json(foundAppRate);
    } else {
      return res.status(404).json({ msg: "appRate not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllAppRates = async (req, res) => {
  let { comment, rater, rating } = req.query;
  const queryObj = {
    ...(rating && { rating }),
    ...(comment && { comment: new RegExp(`${comment}`) }),
    ...(rater && { rater }),
  };
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;

  try {
    const getAppRates = await AppRate.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res
      .status(200)
      .send({ res: getAppRates, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneAppRate = async (req, res) => {
  const updatedAppRate = await AppRate.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
    }
  );
  if (updatedAppRate) {
    console.log({ updatedAppRate });
    const loggedUser = await User.findById(req.user.id);
    if (updatedAppRate.rater == req.user.id || loggedUser.role === "admin") {
      return res.status(200).send(updatedAppRate);
    } else {
      return res
        .status(403)
        .json({ msg: "you are not authorized to perform this operation" });
    }
  } else {
    return res.status(404).json({ msg: "appRate not updated" });
  }
};

exports.deleteOneAppRate = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  try {
    const deletedAppRate = await AppRate.findById(id);
    if (deletedAppRate) {
      console.log({ deletedAppRate });
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedAppRate.rater._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedAppRate.remove().then(() => {
          return res.status(200).send(deletedAppRate);
        });
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "appRate not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
