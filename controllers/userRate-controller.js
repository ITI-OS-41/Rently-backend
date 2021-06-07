const UserRate = require("../models/UserRate")
import { USERRATE, ID } from "../helpers/errors"
const ObjectId = require('mongoose').Types.ObjectId;

const validateUserRate = require("../validation/userRate")



exports.create = async (req, res) => {
  const { isValid, errors } = await validateUserRate(req.body)
  

  if (!isValid) {
    return res.status(404).json(errors)
  }

  const userRate = new UserRate({
    ...req.body
  })

  await userRate
    .save()
    .then((userRate) => {
      res.json({ userRate })
    })
    .catch((err) => {
     
      return res.status(500).send({ msg: USERRATE.badRequest })
    })
}

exports.getAll = async (req, res) => {
  let { _id, owner, renter } = req.query
 const queryObj = {
    ...(_id && { _id }),
    ...(owner && { owner }),
    ...(renter && { renter }),
  }


  await UserRate.find(queryObj)
    .then((objects) => {
      res.status(200).send(objects)
    })
}

exports.getOne = (req, res) => {
  
  const Id = req.params.id

  UserRate.findById(Id)
    .then((userRate) => {
      if (userRate) {
        return res.json({
          _id: userRate._id,
          owner: userRate.owner,
          renter: userRate.renter,
          rating: userRate.rating,
          comment: userRate.comment,
        })
      } else {
        return res.status(404).json({ msg: USERRATE.notFound })
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ msg: ITEMRATE.invalidId })
    })
}

exports.update = async (req, res) => {
  const id = req.params.id

  const { isValid, errors } = await validateUserRate(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }
  await UserRate.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .select({ owner: 0 ,renter:0})
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

  UserRate.findById(req.params.id)
    .then((userRate) => {
      if (userRate) {
        userRate
          .remove()
          .then(() => {
            return res.status(200).send(userRate)
          })
      } else {
        return res.status(404).json({ msg: USERRATE.notFound })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: USERRATE.notFound })
    })
}
