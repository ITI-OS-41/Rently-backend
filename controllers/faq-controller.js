/** @format */
const { validateId } = require("../helpers/errors");
const Faq = require("../models/Faq");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User")

exports.createOneFaq = async (req, res) => {
  req.body.createdBy = req.user.id;
  req.body.category=req.params.categoryId
  req.body.subCategory=req.params.subCategoryId

  const question = await new Faq(req.body)
  try {
const savedQuestion = await question.save();
if(savedQuestion){
 await SubCategory.updateMany(
        { _id: savedQuestion.subCategory },
        { $push: { faq: savedQuestion._id } }
      );
      return res.status(200).json(savedQuestion);
    } else {
      return res.status(404).json({ msg: "question not saved" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getOneFaq = async (req, res) => {
  const id = req.params.faqId;

  // const idCategoryCheck = await categoryIdCheck(req.params.categoryId, res);
  // if (Object.keys(idCategoryCheck).length > 0) {
  //   return res.status(404).json(idCategoryCheck);
  // }

  // const idSubCategoryCheck = await subCategoryIdCheck(req.params.subCategoryId, res);
  // if (Object.keys(idSubCategoryCheck).length > 0) {
  //   return res.status(404).json(idSubCategoryCheck);
  // }
  if (!validateId(id, res)) {
    return res.status(404).json({ msg: "invalid faq id" });
  }
    try {
    const foundFaq = await Faq.findById(id);
    if (foundFaq) {
      return res.json(foundFaq);
    } else {
      return res.status(404).json({ msg: "faq not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
  }

exports.getAllFaqs = async (req, res) => {
  let { _id, slug,category, questions,subCategory } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = page * limit - limit;

  const queryObj = {
    ...(category && { category: new RegExp(`${category}`) }),
    ...(questions && { questions: new RegExp(`${questions}`) }),
    ...(subCategory && { subCategory: new RegExp(`${subCategory}`) }),
    ...(slug && { slug }),
  };

  // const idCategoryCheck = await categoryIdCheck(req.params.categoryId, res);
  // if (Object.keys(idCategoryCheck).length > 0) {
  //   return res.status(404).json(idCategoryCheck);
  // }

  // const idSubCategoryCheck = await subCategoryIdCheck(req.params.subCategoryId, res);
  // if (Object.keys(idSubCategoryCheck).length > 0) {
  //   return res.status(404).json(idSubCategoryCheck);
  // }

  try {
  const getFaqs = await Faq.find(queryObj)
    .limit(limit)
    .skip(skip)
    .sort(sortQuery);
    res.status(200).send({ res: getFaqs, pagination: { limit, skip, page } });
}catch (err) {
    res.status(500).json(err);
  }
};


exports.updateOneFaq = async (req, res) => {
  try{
   const updatedFaq= await Faq.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  })

  const loggedUser = await User.findById(req.user.id);
  console.log(updatedFaq.createdBy != req.user.id && loggedUser.role !== "admin")
  if (updatedFaq.createdBy == req.user.id && loggedUser.role === "admin") {
      return res
        .status(404)
        .json({ msg: "you are not authorized to perform this operation" });
    } else {
      return res.status(200).send(updatedFaq);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.deleteOneFaq = async (req, res) => {
  const id = req.params.id;
  if (!validateId(id, res)) {
    Faq.findById(id)
      .then((question) => {
        if (question) {
          question.remove().then(() => {
            return res.status(200).send(question);
          });
        } else {
          return res.status(404).json({ msg: "question not found" });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ msg: "question invalidId" });
      });
  }
};
