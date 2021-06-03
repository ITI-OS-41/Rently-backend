const router = require("express").Router()

// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/notification-controller")

// * GET ONE
router.get("/:id", getOne)

// * GET ALL
router.get("/", getAll)

// * UPDATE
router.post("/", create)

// * UPDATE
router.post("/:id", update)

// * DELETE
router.delete("/:id", deleteOne,)


module.exports = router
