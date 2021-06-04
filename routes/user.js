const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport = require("passport")

// Import controllers
const {
  getOne,
  getAll,
  update,
  deleteOne,
} = require("../controllers/user-controller")

// * GET ALL
router.get("/", passport.authenticate("jwt", { session: false }), getAll)

// * GET ONE
router.get("/:id", getOne)

// * UPDATE
router.post("/:id", passport.authenticate("jwt", { session: false }), update)

// * DELETE
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteOne,
)


module.exports = router
