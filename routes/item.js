const router = require("express").Router()

// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/item-controller")
const { catchErrors } = require("../helpers/errors");
const validateItem = require("../validation/item");
const auth = require("../middleware/auth");

// * GET ALL
router.get("/", getAll)


// * GET ONE
router.get("/:id", getOne)


// * CREATE
router.post("/", auth,catchErrors(create))

// * UPDATE
router.post("/:id", update)

// * DELETE
router.delete("/:id", deleteOne,)


module.exports = router
