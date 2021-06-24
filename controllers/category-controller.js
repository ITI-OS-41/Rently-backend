const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const Category = mongoose.model("Category");

// * Create and Save a new Category
exports.createOneCategory = async (req, res) => {
  req.body.createdBy = req.user.id;
  const category = await new Category(req.body);
  try {
    const savedCategory = await category.save();
    if (savedCategory) {
      return res.status(200).json(savedCategory);
    } else {
      return res.status(404).json({ msg: "category not saved" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//* Get One
exports.getOneCategory = async (req, res) => {
  const id = req.params.id;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid category id" });
  }
  try {
    const foundCategory = await Category.findById(id);
    if (foundCategory) {
      return res.status(200).json(foundCategory);
    } else {
      return res.status(404).json({ msg: "category not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

//* Get ALL
exports.getAllCategories = async (req, res) => {
  let { name, model, subCategory, createdBy } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;
  const queryObj = {
    ...(model && { model: new RegExp(`${model}`) }),
    ...(name && { name: new RegExp(`${name}`) }),
    ...(subCategory && { subCategory }),
    ...(createdBy && { createdBy }),
  };
  try {
    const getCategories = await Category.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    res.status(200).send({ getCategories, pagination: { limit, skip, page } });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateOneCategory = async (req, res) => {
  const { photo, name, description, model } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { createdBy: req.user.id, name, photo, description, model },
      {
        new: true,
      }
    );

    if (updatedCategory) {
      return res.status(200).send(updatedCategory);
    } else {
      return res.status(403).json({ msg: "category not updated" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.deleteOneCategory = async (req, res) => {
  const id = req.params.id;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid category id" });
  }
  try {
    const deletedCategory = await Category.findById(id);
    if (deletedCategory) {
      deletedCategory.remove().then(() => {
        return res.status(200).send(deletedCategory);
      });
    } else {
      return res.status(404).json({ msg: "category not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
