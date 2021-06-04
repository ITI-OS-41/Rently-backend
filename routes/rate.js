const router = require("express").Router()
const Rate = require("../models/Rate")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport = require("passport")

// Import controllers
const {
  add,
  getOne,
  getAll,
  update,
  deleteOne,
} = require("../controllers/rate-controller")

// * GET ONE
router.post("/", add)

// * GET ONE
router.get("/:id", getOne)

// * GET ALL
router.get("/", getAll)

// * UPDATE
router.post("/:id", update)

// * DELETE
router.delete(
  "/:id",
  deleteOne,
)

module.exports = router
