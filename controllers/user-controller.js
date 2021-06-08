const User = require("../models/User")
import { USER } from "../helpers/errors"

const validateRegisterInput = require("../validation/register")


exports.getAll = async (req, res) => {
  let { _id, username, email } = req.query
  const queryObj = {
    ...(_id && { _id }),
    ...(username && { username }),
    ...(email && { email }),
  }

  // * ...(email && { email: /regex here/ }),

  await User.find(queryObj)
    .select({ password: 0 })
    .then((objects) => {
      res.status(200).send(objects)
    })
}

exports.getOne = (req, res) => {
  const Id = req.params.id 

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid
    })
  }


  User.findById(Id)
    .then((user) => {
      if (user) {
        return res.json({
          _id: user._id,
          email: user.email,
          username: user.username,
        })
      } else {
        return res.status(404).json({ msg: USER.notFound })
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ msg: USER.invalidId })
    })
}

exports.update = async (req, res) => {

  const id = req.params.id
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid
    })
  }

  // ADD USER VALIDATION

  const { isValid, errors } = await validateRegisterInput(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }

  await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .select({ password: 0 })
    .then((response) => {
      res.status(200).send(response)
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}

exports.deleteOne = async (req, res) => {

  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid
    })
  }

  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        user
          .remove()
          .select({ password: 0 })
          .then(() => {
            return res.status(200).send(user)
          })
      } else {
        return res.status(404).json({ msg: "User not found!" })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}
