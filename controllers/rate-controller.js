const Rate = require("../models/Rate")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validateRate = require("../validation/rate")
import { RATE } from "../helpers/errors"




exports.add = async (req, res) => {
	const rate = await new Rate(req.body).save();
	console.log(rate);
	res.status(200).send(rate);
};

exports.getAll = async (req, res) => {
  let { _id, item_id, ratingNumber,totalPoints } = req.query
 const queryObj = {
    ...(_id && { _id }),
    ...(item_id && { item_id }),
    ...(ratingNumber && { ratingNumber }),
  }


  await Rate.find(queryObj)
    .then((objects) => {
      res.status(200).send(objects)
    })
}

exports.getOne = (req, res) => {
  const Id = req.params.id

  Rate.findById(Id)
    .then((rate) => {
      if (rate) {
        return res.json({
          _id: rate._id,
          item_id: rate.item_id,
          ratingNumber: rate.ratingNumber,
          totalPoints: rate.totalPoints,
        })
      } else {
        return res.status(404).json({ msg: RATE.notFound })
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ msg: RATE.invalidId })
    })
}

exports.update = async (req, res) => {
  await Rate.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .select({ item_id: 0 })
    .then((response) => {
      res.status(200).send(response)
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}

exports.deleteOne = async (req, res) => {
  Rate.findById(req.params.id)
    .then((rate) => {
      if (rate) {
        rate
          .remove()
          .then(() => {
            return res.status(200).send(rate)
          })
      } else {
        return res.status(404).json({ msg: RATE.notFound })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: RATE.notFound })
    })
}
