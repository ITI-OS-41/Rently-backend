/** @format */
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const router = require("express").Router();
const validateCategory = require("../validation/category");

// Import category controllers
const {
  createOneCategory,
  getOneCategory,
  getAllCategories,
  updateOneCategory,
  deleteOneCategory,
} = require("../controllers/category-controller");


//*******************
//* category routes
//*******************

//  * Create New

router.post("/", auth,authAdmin, validateCategory, createOneCategory);
// * GET ONE
router.get("/:id", getOneCategory);
// * GET ALL
router.get("/",getAllCategories);
// * UPDATE
router.post("/:id", auth,authAdmin, validateCategory, updateOneCategory);
// * DELETE
router.delete("/:id", auth, authAdmin, deleteOneCategory);

module.exports = router;
