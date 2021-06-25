/** @format */

const ObjectId = require("mongoose").Types.ObjectId;
const { validateId } = require("../helpers/errors");
const User = require("../models/User");
const Item = require("../models/Item");

exports.createOneItem = async (req, res) => {
  req.body.owner = req.user.id;

  const item = await new Item(req.body);
  try {
    const savedItem = await item.save();
    if (savedItem) {
      return res.status(200).json(savedItem);
    } else {
      return res.status(404).json({ msg: "item not saved" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getOneItem = async (req, res) => {
  const id = req.params.id;

  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid item  id" });
  }
  try {
    const foundItem = await Item.findById(id);
    if (foundItem) {
      return res.status(200).json(foundItem);
    } else {
      return res.status(404).json({ msg: "item not found " });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllItems = async (req, res) => {
  let {
    name,
    owner,
    category,
    subcategory,
    isAvailable,
    isPublished,
    isSubmitted,
    description,
    condition,
    stock,
    cancellation,
    isDeliverable,
    deposit,
    price,
    location,
    slug,
  } = req.query;
  const queryObj = {
    ...(name && { name: new RegExp(`${name}`) }),
    ...(description && { description: new RegExp(`${description}`) }),
    ...(owner && { owner }),
    ...(category && { category }),
    ...(subcategory && { subcategory }),
    ...(isPublished && { isPublished }),
    ...(isSubmitted && { isSubmitted }),
    ...(isAvailable && { isAvailable }),
    ...(slug && { slug }),
    ...(condition && { condition }),
    ...(stock && { stock }),
    ...(cancellation && { cancellation }),
    ...(isDeliverable && { isDeliverable }),
    ...(deposit && { deposit }),
    ...(price && { price }),
    ...(location && { location }),
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
    const getItems = await Item.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res
      .status(200)
      .send({ res: getItems, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneItem = async (req, res) => {
  const updatedItem = await Item.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
    }
  );
  if (updatedItem) {
    const loggedUser = await User.findById(req.user.id);
    if (updatedItem.owner == req.user.id || loggedUser.role === "admin") {
      return res.status(200).send(updatedItem);
    } else {
      return res
        .status(403)
        .json({ msg: "you are not authorized to perform this operation" });
    }
  } else {
    return res.status(403).json({ msg: "item not updated" });
  }
};

exports.deleteOneItem = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid item id" });
  }
  try {
    const deletedItem = await Item.findById(id);
    console.log(deletedItem);
    if (deletedItem) {
      const loggedUser = await User.findById(req.user.id);
      if (deletedItem.owner._id == req.user.id || loggedUser.role === "admin") {
        deletedItem.remove().then(() => {
          return res.status(200).send(deletedItem);
        });
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "item not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
