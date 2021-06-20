/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateFaq = require("../validation/faq");
const { catchErrors } = require("../helpers/errors");
// Import controllers
const {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
} = require("../controllers/faq-controller");
// * create Faq

router.post("/", validateFaq, catchErrors(create));
// * GET ONE
router.get("/:id", catchErrors(getOne));

// * GET ALL
router.get("/", catchErrors(getAll));

// * UPDATE
router.post("/:id", validateFaq, catchErrors(update));

// * DELETE
router.delete("/:id", catchErrors(deleteOne));

module.exports = router;
