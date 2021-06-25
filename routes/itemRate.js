/** @format */

const router = require("express").Router();
// Import controllers
const {
	getOneItemRate,
	getAllItemRates,
	createOneItemRate,
	updateOneItemRate,
	deleteOneItemRate,
} = require("../controllers/itemRate-controller");
const validateItemRate = require("../validation/itemRate");
const auth = require("../middleware/auth");

// * CREATEOneItemRate
router.post("/", auth, validateItemRate, createOneItemRate);

// * GET ALL ItemRates
router.get("/", getAllItemRates);

// * GET ONE ItemRate
router.get("/:id", getOneItemRate);

// * UPDATEOneItemRate
router.post("/:id",auth, validateItemRate, updateOneItemRate);

// * DELETE One ItemRate
router.delete("/:id", auth, deleteOneItemRate);

module.exports = router;
