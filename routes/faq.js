/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();

// Import controllers
const {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
} = require("../controllers/faq-controller");
// * create Faq

router.post("/", auth, create);
// * GET ONE Faq
router.get("/:id", getOne);

// * GET ALL Faqs
router.get("/", getAll);

// * UPDATE One Faq
router.post("/:id", auth, update);

// * DELETE One Faq
router.delete("/:id", deleteOne);

module.exports = router;
