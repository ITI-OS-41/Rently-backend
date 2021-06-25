const auth = require("../middleware/auth");
const router = require("express").Router();
const validateRent = require("../validation/rent");

//Import Rent Controllers
const {
  createOneRent,
  getOneRent,
  getAllRents,
  updateOneRent,
  deleteOneRent,
} = require("../controllers/rent-controller");

// * create
router.post("/", auth, validateRent, createOneRent);

// * GET ALL
router.get("/", auth, getAllRents);

// * GET ONE
router.get("/:id", auth, getOneRent);

// * UPDATE
router.post("/:id", auth, validateRent, updateOneRent);

// * DELETE
router.delete("/:id", auth, deleteOneRent);

module.exports = router;
