const router = require("express").Router()

// Import controllers
const {
  createOneItem,
  getOneItem,
  getAllItems,
  updateOneItem,
  deleteOneItem,
} = require("../controllers/item-controller")
const validateItem = require("../validation/item");
const auth = require("../middleware/auth");

// * CREATE
router.post("/", validateItem, createOneItem);

// * GET ONE
router.get("/:id", getOneItem);

// * GET ALL
router.get("/", getAllItems);

// * UPDATE
router.post("/:id", auth, validateItem, updateOneItem);

// * DELETE
router.delete("/:id", auth, deleteOneItem);


module.exports = router
