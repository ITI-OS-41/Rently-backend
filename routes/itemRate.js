/** @format */

const router = require("express").Router();
// Import controllers
const {
	getOne,
	getAll,
	create,
	update,
	deleteOne,
} = require("../controllers/itemRate-controller");
const { catchErrors } = require("../helpers/errors");
const validateItemRate = require("../validation/itemRate");
const auth = require("../middleware/auth");

// * CREATE
router.post("/:id", auth, validateItemRate, catchErrors(create));

// * GET ALL
router.get("/", catchErrors(getAll));

// * GET ONE
router.get("/:id", catchErrors(getOne));

// * UPDATE
router.post("/:id", validateItemRate, catchErrors(update));

// * DELETE
router.delete("/:id", catchErrors(deleteOne));

module.exports = router;
