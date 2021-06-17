const router = require("express").Router()

// Import controllers
const {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} = require("../controllers/itemRate-controller")
const { catchErrors } = require("../helpers/errors")
const validateItemRate = require("../validation/itemRate");

// * GET ALL
router.get("/", getAll)


// * GET ONE
router.get("/:id", getOne)


// * UPDATE
router.post("/",validateItemRate,catchErrors(create))

// * UPDATE
router.post("/:id", update)

// * DELETE
router.delete("/:id", deleteOne)


module.exports = router
