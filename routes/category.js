/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const { catchErrors } = require("../helpers/errors");
const validateCategory = require("../validation/category");
// Import controllers
const {
	getOne,
	getAll,
	update,
	deleteOne,
	create,
} = require("../controllers/category-controller");
//  * Create New
router.post("/", auth, validateCategory, catchErrors(create));
// * GET ONE
router.get("/:id", catchErrors(getOne));

// * GET ALL
router.get("/", catchErrors(getAll));

// * UPDATE
router.post("/:id",auth, validateCategory, catchErrors(update));

// * DELETE
router.delete("/:id", catchErrors(deleteOne));

module.exports = router;
