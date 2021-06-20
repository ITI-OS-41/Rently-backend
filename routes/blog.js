/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const { catchErrors } = require("../helpers/errors");
const validateBlog = require("../validation/blog");
// Import controllers
const {
	create,
	getAll,
	getOne,
	update,
	deleteOne,
} = require("../controllers/blog-controller");
// * create blog

router.post("/", auth, validateBlog, catchErrors(create));
// * GET ONE
router.get("/:id", catchErrors(getOne));

// * GET ALL
router.get("/", catchErrors(getAll));

// * UPDATE
router.post("/:id", auth, validateBlog, catchErrors(update));

// * DELETE
router.delete("/:id", catchErrors(deleteOne));


module.exports = router;
