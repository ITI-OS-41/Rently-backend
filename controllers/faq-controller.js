/** @format */
const { validateId } = require("../helpers/errors");
const Faq = require("../models/Faq");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");

exports.createOneFaq = async (req, res) => {
  req.body.createdBy = req.user.id;

  const question = await new Faq(req.body);
  try {
    const savedQuestion = await question.save();
    if (savedQuestion) {
      await SubCategory.updateMany(
        { _id: savedQuestion.subCategory },
        { $push: { faq: savedQuestion._id } }
      );
      return res.status(200).json(savedQuestion);
    } else {
      return res.status(404).json({ msg: "question not saved" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getOneFaq = async (req, res) => {
  const id = req.params.id;

  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid faq id" });
  }

  try {
    const foundFaq = await Faq.findById(id);
    if (foundFaq) {
      return res.status(200).json(foundFaq);
    } else {
      return res.status(404).json({ msg: "faq not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllFaqs = async (req, res) => {
  let { slug, category, questions, subCategory } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;

  const queryObj = {
    ...(category && { category: new RegExp(`${category}`) }),
    ...(questions && { questions: new RegExp(`${questions}`) }),
    ...(subCategory && { subCategory: new RegExp(`${subCategory}`) }),
    ...(slug && { slug }),
  };

  try {
    const getFaqs = await Faq.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res.status(200).send({ res: getFaqs, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneFaq = async (req, res) => {
  try {
    const updatedFaq = await Faq.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (updatedFaq) {
      return res.status(200).send(updatedFaq);
    } else {
      return res.status(404).json({ msg: "faq not updated" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.deleteOneFaq = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid faq id" });
  }
  try {
    const deletedFaq = await Faq.findById(id);
    if (deletedFaq) {
      deletedFaq.remove().then(() => {
        return res.status(200).send(deletedFaq);
      });
    } else {
      return res.status(404).json({ msg: "faq not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
