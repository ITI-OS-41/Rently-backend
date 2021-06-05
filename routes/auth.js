const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport = require("passport")

// const validateRegisterInput = require("../validation/register")
const validateLoginInput = require("../validation/login")

// Import controllers
const { register, login } = require("../controllers/auth-controller")

router.post("/register", register)
router.post("/login", login)

module.exports = router
