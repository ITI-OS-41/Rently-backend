const router = require("express").Router()
// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/rent-controller")

const validateRent = require("../validation/rent")
const {catchErrors} = require("../helpers/errors")

// * GET ALL
router.get("/", getAll)


// * GET ONE
router.get("/:id", getOne)


// * UPDATE
router.post("/",validateRent,catchErrors(create))

// * UPDATE
router.post("/:id",validateRent, update)

// * DELETE
router.delete("/:id", deleteOne)


module.exports = router
