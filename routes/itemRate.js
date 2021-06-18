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
router.post("/", auth, validateItemRate, catchErrors(create));

// * GET ALL
router.get("/", getAll);

// * GET ONE
router.get("/:id", getOne);

// * UPDATE
router.post("/:id", validateItemRate, catchErrors(update));

// * DELETE
router.delete("/:id", deleteOne);

module.exports = router;
