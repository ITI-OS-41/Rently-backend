/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateUserRate = require("../validation/userRate");

// Import controllers
const {
	getOneUserRate,
	getAllUserRates,
	createOneUserRate,
	updateOneUserRate,
	deleteOneUserRate,
} = require("../controllers/userRate-controller");

// * CREATE
router.post("/", auth, validateUserRate, createOneUserRate);

// * GET ONE
router.get("/:id", getOneUserRate);

// * GET ALL
router.get("/", getAllUserRates);

// * UPDATE
router.post("/:id", auth, validateUserRate, updateOneUserRate);

// * DELETE
router.delete("/:id", auth, deleteOneUserRate)

module.exports = router;
