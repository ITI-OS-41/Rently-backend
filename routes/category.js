/** @format */
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const router = require("express").Router();
const { catchErrors } = require("../helpers/errors");
const validateCategory = require("../validation/category");
const validateBlog = require("../validation/blog");
// Import category controllers
const {
  createOneCategory,
  getOneCategory,
  getAllCategories,
  updateOneCategory,
  deleteOneCategory,
} = require("../controllers/category-controller");


// Import faq controllers
const {
  createOneFaq,
  getOneFaq,
  getAllFaqs,
  updateOneFaq,
  deleteOneFaq,
} = require("../controllers/faq-controller");


//****************** 
//*Faq routes
//****************

// * create faq
router.post("/:categoryId/subCategory/:subCategoryId/faq", auth,authAdmin, validateBlog, createOneFaq);
// * GET ONE faq
router.get("/:categoryId/subCategory/:subCategoryId/faq/:faqId",getOneFaq);
// * GET ALL faqs
router.get("/:categoryId/subCategory/:subCategoryId/faq",getAllFaqs);
// * UPDATE faq
router.post("/:categoryId/subCategory/:subCategoryId/faq/:faqId", auth, authAdmin,validateBlog, updateOneFaq);
// * DELETE faq
router.delete("/:categoryId/subCategory/:subCategoryId/faq/:faqId", auth,authAdmin, deleteOneFaq);

//*******************
//* category routes
//*******************

//  * Create New

router.post("/", auth, validateCategory, catchErrors(createOneCategory));
// * GET ONE
router.get("/:id", catchErrors(getOneCategory));
// * GET ALL
router.get("/", catchErrors(getAllCategories));
// * UPDATE
router.post("/:id", auth, validateCategory, catchErrors(updateOneCategory));
// * DELETE
router.delete("/:id", catchErrors(deleteOneCategory));

module.exports = router;
