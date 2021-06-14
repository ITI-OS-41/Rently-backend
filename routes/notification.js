const router = require("express").Router()

// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/notification-controller")


// * GET ALL
router.get("/", getAll)


// * GET ONE
router.get("/:id", getOne)


// * create
router.post("/", create)

// * UPDATE
router.put("/:id", update)

// * DELETE
router.delete("/:id", deleteOne,)


module.exports = router
