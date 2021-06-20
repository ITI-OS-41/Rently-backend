/** @format */

const router = require("express").Router();
const validateSubCategory = require("../validation/subCategory");

const {
	getOne,
	getAll,
	update,
	deleteOne,
	create,
} = require("../controllers/subCategory-controller");
const { catchErrors } = require("../helpers/errors");

//  * Create
router.post("/", validateSubCategory,catchErrors(create));

// * GET ONE
router.get("/:id", catchErrors(getOne));

// * GET ALL
router.get("/", catchErrors(getAll));

// * UPDATE
router.post("/:id",validateSubCategory, catchErrors(update));

// * DELETE
router.delete("/:id", catchErrors(deleteOne));
module.exports = router;
