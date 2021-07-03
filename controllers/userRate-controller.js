/** @format */
const { validateId } = require("../helpers/errors");
const UserRate = require("../models/UserRate");
const User = require("../models/User");

exports.createOneUserRate = async (req, res) => {
  req.body.owner = req.user.id;
  const userRate = await new UserRate(req.body);
  try {
    const savedUserRate = await userRate.save();
    const loggedUser = await User.findById(req.user.id);

    if (savedUserRate) {
      const user =await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          loggedUser,
          wallet: loggedUser.wallet + 5,
        },
        { new: true }
      );
      console.log({user})
      return res.status(200).json(savedUserRate);
    } else {
      return res.status(404).json({ msg: "userRate not saved" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getOneUserRate = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid userRate id" });
  }
  try {
    const foundUserRate = await UserRate.findById(id);
    if (foundUserRate) {
      return res.status(200).json(foundUserRate);
    } else {
      return res.status(404).json({ msg: "userRate not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllUserRates = async (req, res) => {
  let { rating, comment, item, owner, renter } = req.query;

  const queryObj = {
    ...(rating && { rating }),
    ...(comment && { comment: new RegExp(`${comment}`) }),
    ...(item && { item }),
    ...(owner && { owner }),
    ...(renter && { renter }),
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
    const getUserRates = await UserRate.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res
      .status(200)
      .send({ res: getUserRates, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneUserRate = async (req, res) => {
  try {
    const updatedUserRate = await UserRate.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (updatedUserRate) {
      console.log({ updatedUserRate });
      const loggedUser = await User.findById(req.user.id);
      if (updatedUserRate.owner == req.user.id || loggedUser.role === "admin") {
        return res.status(200).send(updatedUserRate);
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "userRate not updated" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.deleteOneUserRate = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  try {
    const deletedUserRate = await UserRate.findById(id);
    if (deletedUserRate) {
      console.log({ deletedUserRate });
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedUserRate.owner._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedUserRate.remove().then(() => {
          return res.status(200).send(deletedUserRate);
        });
      }
    } else {
      return res.status(404).json({ msg: "userRate not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
