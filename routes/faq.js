/** @format */
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const router = require("express").Router();
const validateFaq = require("../validation/faq");

// Import controllers
const {
  createOneFaq,
  getOneFaq,
  getAllFaqs,
  updateOneFaq,
  deleteOneFaq,
} = require("../controllers/faq-controller");
// * create Faq

router.post("/",auth, authAdmin, validateFaq, createOneFaq);
// * GET ONE
router.get("/:id", getOneFaq);

// * GET ALL
router.get("/", getAllFaqs);

// * UPDATE
router.post("/:id",auth, authAdmin,validateFaq, updateOneFaq);

// * DELETE
router.delete("/:id",auth, authAdmin, deleteOneFaq);

module.exports = router;
