const router = require("express").Router();
const validateAppRate = require("../validation/appRate");
const auth = require("../middleware/auth")
// Import controllers
const {
  createOneAppRate,
  getOneAppRate,
  getAllAppRates,
  updateOneAppRate,
  deleteOneAppRate,
} = require("../controllers/appRate-controller");

// * UPDATE
router.post("/", auth, validateAppRate, createOneAppRate);

// * GET ONE
router.get("/:id", getOneAppRate);

// * GET ALL
router.get("/", getAllAppRates);

// * UPDATE
router.post("/:id", auth, validateAppRate, updateOneAppRate);

// * DELETE
router.delete("/:id", auth, deleteOneAppRate);

module.exports = router;
