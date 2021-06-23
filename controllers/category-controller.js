const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const Category = mongoose.model("Category");

// * Create and Save a new Category
exports.createOneCategory = async (req, res) => {
  req.body.createdBy = req.user.id;
  const category = await new Category(req.body).save();
  res.status(200).send(category);
};

//* Get One
exports.getOneCategory = async (req, res) => {
  const id = req.params.id;
  if (!validateId(id, res)) {
    await Category.findById(id).then((category) => {
      if (category) {
        return res.json(category);
      } else {
        return res.status(404).json({ msg: error });
      }
    });
  }
};

//* Get ALL
exports.getAllCategories = async (req, res) => {
  let { name, model, subcategory } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = page * limit - limit;
  const queryObj = {
    ...(model && { model }),
    ...(name && { name: new RegExp(`${name}`) }),
    ...(subcategory && {
      subcategory: new RegExp(subcategory.replace(/,/g, "|")),
    }),
  };
  const getCategories = await Category.find(queryObj)
    .limit(limit)
    .skip(skip)
    .sort(sortQuery);
  res.status(200).send({ getCategories, pagination: { limit, skip, page } });
};

exports.updateOneCategory = async (req, res) => {
  await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  }).then((response) => {
    res.status(200).send(response);
  });
};

exports.deleteOneCategory = async (req, res) => {
  const id = req.params.id;
  if (!validateId(id, res)) {
    Category.findById(id).then((category) => {
      if (category) {
        category.remove().then(() => {
          return res.status(200).send(category);
        });
      } else {
        return res.status(404).json({ msg: error });
      }
    });
  }
};
