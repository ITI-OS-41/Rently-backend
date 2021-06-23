/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateFaq = require("../validation/faq");

// Import controllers
const {
  createOneFaq,
  getAllFaqs,
  getOneFaq,
  updateOneFaq,
  deleteOneFaq,
} = require("../controllers/faq-controller");
// * create Faq

router.post("/",auth, validateFaq, createOneFaq);
// * GET ONE
router.get("/:id", getOneFaq);

// * GET ALL
router.get("/", getAllFaqs);

// * UPDATE
router.post("/:id",auth, updateOneFaq);

// * DELETE
router.delete("/:id", deleteOneFaq);

module.exports = router;
