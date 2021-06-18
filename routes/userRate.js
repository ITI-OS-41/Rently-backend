const router = require("express").Router()
const validateUserRate = require("../validation/userRate");
const { catchErrors } = require("../helpers/errors");

// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/userRate-controller")

// * CREATE
router.post("/", validateUserRate, catchErrors(create));

// * GET ALL
router.get("/", getAll)


// * GET ONE
router.get("/:id", getOne)

// * UPDATE
router.post("/:id", validateUserRate, catchErrors(update))

// * DELETE
router.delete("/:id", deleteOne)


module.exports = router
