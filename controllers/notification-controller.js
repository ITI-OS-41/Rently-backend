const Notification = require("../models/Notification")
import { USER } from "../helpers/errors"

exports.getAll = async (req, res) => {
  let { _id, receiver, sender } = req.query
  const queryObj = {
    ...(_id && { _id }),
    ...(receiver && { receiver }),
    ...(sender && { sender }),
  }

  // * ...(email && { email: /regex here/ }),

  await Notification.find(queryObj)
    .then((objects) => {
      res.status(200).send(objects)
    })
}

exports.getOne = (req, res) => {
  const Id = req.params.id

  Notification.findById(Id)
    .then((notification) => {
      if (notification) {
        return res.json(notification)
      } else {
        return res.status(404).json({ msg: USER.notFound })
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ msg: USER.invalidId })
    })
}

exports.create = async (req, res) => {
  const notification = new Notification({
    receiver: req.body.receiver,
    sender: req.body.sender,
    content: req.body.content,
  })

  await notification
    .save()
    .then((result) => {
      res.json({ notification })
    })
    .catch((err) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}


exports.update = async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id }, req.body, {
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
  Notification.findById(req.params.id)
    .then((notification) => {
      if (notification) {
        notification
          .remove()
          .then(() => {
            return res.status(200).send(notification)
          })
      } else {
        return res.status(404).json({ msg: "Notification not found!" })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}
