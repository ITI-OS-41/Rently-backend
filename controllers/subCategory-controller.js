const { validateId } = require("../helpers/errors");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
// * Create and Save a new Category
exports.createOneSubCategory = async (req, res) => {
  req.body.createdBy = req.user.id;
  const subCategory = await new SubCategory(req.body);
  try {
    const savedsubCategory = await subCategory.save();
    if (savedsubCategory) {
      await Category.updateMany(
        { _id: savedsubCategory.category },
        { $push: { subcategory: savedsubCategory._id } }
      );
      return res.status(200).json(savedsubCategory);
    } else {
      return res.status(404).json({ msg: "subCategory not saved" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

//* Get One
exports.getOneSubCategory = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid subCategory id" });
  }
  try {
    const foundSubCategory = await SubCategory.findById(id);
    if (foundSubCategory) {
      return res.status(200).json(foundSubCategory);
    } else {
      return res.status(404).json({ msg: "subCategory not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

//* Get ALL
exports.getAllSubCategories = async (req, res) => {
  let { name, description, category, createdBy } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = page * limit - limit;

  const queryObj = {
    ...(name && { name: new RegExp(`${name}`) }),
    ...(description && { description: new RegExp(`${description}`) }),
    ...(createdBy && { createdBy }),
    ...(category && { category }),
  };
  try {
    const getSubCategories = await SubCategory.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res
      .status(200)
      .send({ res: getSubCategories, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneSubCategory = async (req, res) => {
  try {
    const updatedSubCategory = await SubCategory.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (updatedSubCategory) {
      return res.status(200).send(updatedSubCategory);
    } else {
      return res.status(404).json({ msg: "subCategory not updated" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.deleteOneSubCategory = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid subCategory id" });
  }
  try {
    const deletedSubCategory = await SubCategory.findById(id);
    if (deletedSubCategory) {
      deletedSubCategory.remove().then(() => {
        return res.status(200).send(deletedSubCategory);
      });
    } else {
      return res.status(404).json({ msg: "subCategory not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
