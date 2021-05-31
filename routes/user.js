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

// * GET ONE
router.get("/:id", getOne)
router.get("/", passport.authenticate("jwt", { session: false }), getAll)
router.post("/:id", passport.authenticate("jwt", { session: false }), update)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteOne,
)

// * GET ALL

module.exports = router
