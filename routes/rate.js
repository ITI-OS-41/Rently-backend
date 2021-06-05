const router = require("express").Router()

// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/rate-controller")

// * GET ALL
router.get("/", getAll)


// * GET ONE
router.get("/:id", getOne)


// * UPDATE
router.post("/", create)

// * UPDATE
router.post("/:id", update)

// * DELETE
router.delete("/:id", deleteOne,)


module.exports = router
