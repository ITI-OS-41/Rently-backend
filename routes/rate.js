const router = require("express").Router()
<<<<<<< HEAD

// Import controllers
const {
  getOne,
  getAll,
  create,
=======
const Rate = require("../models/Rate")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport = require("passport")

// Import controllers
const {
  add,
  getOne,
  getAll,
>>>>>>> f55c34272998a2114b500dbacc08d207c5987aa4
  update,
  deleteOne,
} = require("../controllers/rate-controller")

<<<<<<< HEAD
// * GET ALL
router.get("/", getAll)

=======
// * GET ONE
router.post("/", add)
>>>>>>> f55c34272998a2114b500dbacc08d207c5987aa4

// * GET ONE
router.get("/:id", getOne)

<<<<<<< HEAD

// * UPDATE
router.post("/", create)
=======
// * GET ALL
router.get("/", getAll)
>>>>>>> f55c34272998a2114b500dbacc08d207c5987aa4

// * UPDATE
router.post("/:id", update)

// * DELETE
<<<<<<< HEAD
router.delete("/:id", deleteOne,)

=======
router.delete(
  "/:id",
  deleteOne,
)
>>>>>>> f55c34272998a2114b500dbacc08d207c5987aa4

module.exports = router
