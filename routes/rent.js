const auth = require("../middleware/auth");
const router = require("express").Router();
const validateRent = require("../validation/rent");

//Import Rent Controllers
const {
  createOneRent,
  getOneRent,
  getAllRents,
  updateOneRent,
  updateRentStatus,
  updateRentCheckout,
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

// * UPDATE STATUS
router.patch("/:id", auth, updateRentStatus);

// * UPDATE PAYMENT STATUS
router.patch("/checkout/:id", auth, updateRentCheckout);

// * DELETE
router.delete("/:id", auth, deleteOneRent);

module.exports = router;
