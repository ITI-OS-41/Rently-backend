/** @format */

const {
  faqIdCheck,
  categoryIdCheck,
  subCategoryIdCheck,
  assignEmptyErrorsToFields,
  assignErrorsToMissingFields,
  getTwoArraysDifferences,
  missingFieldsChecker,
} = require("../helpers/errors");

const Faq = require("../models/Faq");
const Category = require("../models/Category");
module.exports = async (req, res, next) => {
  let errors = {};
  const id = req.params.id;
  const data = req.body;
  const requiredFields = Faq.requiredFields();
  const requestBody = Object.keys(data);

  const idFaqCheck = await faqIdCheck(id, res);
  if (Object.keys(idFaqCheck).length > 0) {
    return res.status(404).json(idFaqCheck);
  }

  let missingFields = missingFieldsChecker(requestBody, requiredFields);

  errors = assignErrorsToMissingFields(missingFields);

  let difference = getTwoArraysDifferences(requiredFields, missingFields);

  errors = {
    ...errors,
    ...assignEmptyErrorsToFields(data, difference),
  };

  if (data["questions"]) {
    if (!data["questions"].question || !data["questions"].answer) {
      errors.questions = "questions field is empty";
    }
  } else {
    errors.questions = "questions field is required";
  }

  const idCategoryCheck = await categoryIdCheck(data.category, res);
  if (Object.keys(idCategoryCheck).length > 0) {
    errors.category = idCategoryCheck;
  }

  const idSubCategoryCheck = await subCategoryIdCheck(data.subCategory, res);
  if (Object.keys(idSubCategoryCheck).length > 0) {
    errors.subCategory = idSubCategoryCheck;
  }

  if(!errors.category && !errors.subCategory){
    const includeSubCheck= await Category.find({_id:data.category})
    if (includeSubCheck.length===1){
      if(includeSubCheck[0].subcategory.indexOf(data.subCategory)===-1){
        errors.subCategory= "subset error, the provided SubCategory is not part of the provided Category"
      }
    }
  }

  if (!errors.category && !errors.subCategory) {
    const duplicationCheck = await Faq.find({
      category: data.category,
      "questions.question": data["questions"].question,
    });
    if (duplicationCheck.length){
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "a blog with this title has been published in this category, please choose another title";
        }
      } else if (duplicationCheck.length) {
        errors.duplication =
          "a blog with this title has been published in this category, please choose another title";
      }
  }
}

  if (Object.keys(errors).length > 0) {
    // console.log(data, errors);
    return res.status(404).json(errors);
  } else {
    return next();
  }
};
