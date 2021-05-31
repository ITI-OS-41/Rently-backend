const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport = require("passport")

// const validateRegisterInput = require("../validation/register")
const validateLoginInput = require("../validation/login")

// Import controllers
const { register,login } = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)

router.route("/search").post((req, res) => {
  User.findOne({
    $or: [{ email: req.body.text }, { username: req.body.text }],
  })
    .then((user) => {
      console.log(user)
      if (user) {
        res.json({ userId: user._id })
      }
      res.status(404).json({ message: "not found" })
    })
    .catch((err) => console.log(err))
})

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res.json({
          _id: user._id,
          email: user.email,
          username: user.username,
          followers: user.followers,
          following: user.following,
        })
      } else {
        return res.status(404).json({ msg: "User not found!" })
      }
    })
    .catch((err) => console.log(err))
})

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
      _id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      followers: req.user.followers,
      following: req.user.following,
    })
  })

module.exports = router
