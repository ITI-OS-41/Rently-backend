const Rent = require("../models/Rent")
import { RENT, ID } from "../helpers/errors"
const ObjectId = require('mongoose').Types.ObjectId;


const validateRent = require("../validation/rent")

exports.getAll = async (req, res) => {


  let { _id, receiver, sender } = req.query
  const queryObj = {
    ...(_id && { _id }),
    ...(receiver && { receiver }),
    ...(sender && { sender }),
  }

  // * ...(email && { email: /regex here/ }),

  await Rent.find(queryObj)
    .then((objects) => {
      res.status(200).send(objects)
    })
}

exports.getOne = (req, res) => {

  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid
    })
  }

  Rent.findById(id)
    .then((rent) => {
      if (rent) {
        return res.json(rent)
      } else {
        return res.status(404).json({ msg: RENT.notFound })
      }
    })
    .catch((err) => {
      console.log({ err })
      return res.status(500).json({ msg: ID.invalid })
    })
}

exports.create = async (req, res) => {
  const { isValid, errors } = await validateRent(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }


  const rent = new Rent({
    ...req.body
  })

  await rent
    .save()
    .then((result) => {
      res.json({ rent })
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message })
    })
}


exports.update = async (req, res) => {
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid
    })
  }

  const { isValid, errors } = validateRent(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }

  await Rent.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
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

  Rent.findById(req.params.id)
    .then((rent) => {
      if (rent) {
        rent
          .remove()
          .then(() => {
            return res.status(200).send(rent)
          })
      } else {
        return res.status(404).json({ msg: RENT.notFound })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}
