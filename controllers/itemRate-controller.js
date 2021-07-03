/** @format */
const { validateId } = require("../helpers/errors");
const ItemRate = require("../models/ItemRate");
const Item = require("../models/Item");
const User = require("../models/User");

exports.createOneItemRate = async (req, res) => {
  req.body.rater = req.user.id;
  const itemRate = await new ItemRate(req.body);
  try {
    const savedItemRate = await itemRate.save();
        const loggedUser = await User.findById(req.user.id);

    if (savedItemRate) {
       const user=await User.findOneAndUpdate(
         { _id: req.user.id },
         {
           loggedUser,
           wallet:loggedUser.wallet+5,
         },
         { new: true }
       );
      console.log({ user });

        return res.status(200).send(itemRate);
      } else {
      return res.status(404).json({ msg: "itemRate not saved" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getOneItemRate = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid itemRate id" });
  }
  try {
    const foundItemRate = await ItemRate.findById(id);
    if (foundItemRate) {
      return res.status(200).json(foundItemRate);
    } else {
      return res.status(404).json({ msg: "itemRate not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getAllItemRates = async (req, res) => {
  let { rating, comment, item, rater } = req.query;

  const queryObj = {
    ...(rating && { rating }),
    ...(comment && { comment: new RegExp(`${comment}`) }),
    ...(item && { item }),
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
    const getItemRates = await ItemRate.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res
      .status(200)
      .send({ res: getItemRates, pagination: { limit, skip, page } });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateOneItemRate = async (req, res) => {
  try {
    const updatedItemRate = await ItemRate.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (updatedItemRate) {
      console.log({ updatedItemRate });
      const loggedUser = await User.findById(req.user.id);
      if (updatedItemRate.rater == req.user.id || loggedUser.role === "admin") {
        return res.status(200).send(updatedItemRate);
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "itemRate not updated" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteOneItemRate = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  try {
    const deletedItemRate = await ItemRate.findById(id);
    if (deletedItemRate) {
      console.log({ deletedItemRate });
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedItemRate.rater._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedItemRate.remove().then(() => {
          return res.status(200).send(deletedItemRate);
        });
      }
    } else {
      return res.status(404).json({ msg: "itemRate not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};