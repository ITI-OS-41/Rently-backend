const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwt = require("jsonwebtoken")

import { EMAIL, USERNAME, PASSWORD } from "../helpers/errors"

const validateRegisterInput = require("../validation/register")
const validateLoginInput = require("../validation/login")

exports.register = (req, res) => {
  const { isValid, errors } = validateRegisterInput(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = EMAIL.duplicate
      return res.status(404).json(errors)
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        const newUser = new User({
          email: req.body.email,
          username: req.body.username,
          password: hash,
        })

        newUser
          .save()
          .then((newUser) => res.json(newUser))
          .catch((err) => console.log(err))
      })
    })
  })
}

exports.login = (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign(
            { id: user._id },
            process.env.SECRET,
            { expiresIn: "1d" },
            function (err, token) {
              return res.json({
                success: true,
                token: token,
                user: {
                  _id: user._id,
                  email: user.email,
                  username: user.username,
                  followers: user.followers,
                  following: user.following,
                },
              })
            },
          )
        } else {
          errors.password = "Password is incorrect"
          return res.status(404).json(errors)
        }
      })
    } else {
      errors.email = "user not found"
      return res.status(404).json(errors)
    }
  })
}
