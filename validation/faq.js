/** @format */

const {
  faqIdCheck,
  categoryIdCheck,
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

  const idCategoryCheck = await categoryIdCheck(data.category, res);
  if (Object.keys(idCategoryCheck).length > 0) {
    errors.category = idCategoryCheck;
  } else {
    const modelCheck = await Category.findById(data.category);
    if (modelCheck) {
      if (modelCheck.model !== "faq") {
        errors.category = "provided category is not of type faq";
      }
    }
  }



  // if(!errors.category && !errors.subCategory){
  //   const includeSubCheck= await Category.find({_id:data.category})
  //   if (includeSubCheck.length===1){
  //     if(includeSubCheck[0].subcategory.indexOf(data.subCategory)===-1){
  //       errors.subCategory= "subset error, the provided SubCategory is not part of the provided Category"
  //     }
  //   }
  // }

  if (!errors.category ) {
    const duplicationCheck = await Faq.find({
      category: data.category,
    question: data.question,
    });
    if (duplicationCheck.length){
      if (id) {
        if (duplicationCheck.length > 1 || duplicationCheck[0]._id != id) {
          errors.duplication =
            "this question has been answered in this category";
        }
      } else if (duplicationCheck.length) {
        errors.duplication =
          "this question has been answered in this category";
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
