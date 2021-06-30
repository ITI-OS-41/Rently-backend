/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateCart = require("../validation/cart");

// Import category controllers
const {
  createOneCart,
  getOneCart,
  getAllCarts,
  updateOneCart,
  deleteOneCart,
} = require("../controllers/cart-controller");

//*******************
//* Cart routes
//*******************

//  * Create New

router.post("/", auth, validateCart, createOneCart);
// * GET ONE
router.get("/:id", getOneCart);
// * GET ALL
router.get("/", getAllCarts);
// * UPDATE
router.post("/:id", auth, validateCart, updateOneCart);
// * DELETE
router.delete("/:id", auth, deleteOneCart);

module.exports = router;
