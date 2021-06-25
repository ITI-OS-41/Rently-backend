/** @format */

const router = require("express").Router();
const validateSubCategory = require("../validation/subCategory");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const {
  createOneSubCategory,
  getOneSubCategory,
  getAllSubCategories,
  updateOneSubCategory,
  deleteOneSubCategory,
} = require("../controllers/subCategory-controller");
const { catchErrors } = require("../helpers/errors");

//  * Create
router.post("/", auth,authAdmin, validateSubCategory, createOneSubCategory);

// * GET ONE
router.get("/:id", getOneSubCategory);

// * GET ALL
router.get("/", getAllSubCategories);

// * UPDATE
router.post("/:id", auth, authAdmin, validateSubCategory, updateOneSubCategory);

// * DELETE
router.delete("/:id", auth, authAdmin, deleteOneSubCategory);
module.exports = router;
