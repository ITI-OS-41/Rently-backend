const Item = require("../models/Item")
const ObjectId = require('mongoose').Types.ObjectId;


const validateItem = require("../validation/item")

exports.getAll = async (req, res) => {


  let { _id, name, owner, category, subcategory, status, condition,stock, cancellation, deliverable, deposit,price, location  } = req.query
  const queryObj = {
    ...(_id && { _id }),
    ...(name && { name }),
    ...(owner && { owner }),
    ...(category && { category }),
    ...(subcategory && { subcategory }),
    ...(status && { status }),
    ...(condition && { condition }),
    ...(stock && { stock }),
    ...(cancellation && { cancellation }),
    ...(deliverable && { deliverable }),
    ...(deposit && { deposit }),
    ...(price && { price }),
    ...(location && { location })

  }

  // * ...(email && { email: /regex here/ }),

  await Item.find(queryObj)
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

  Item.findById(id)
    .then((item) => {
      if (item) {
        return res.json(item)
      } else {
        return res.status(404).json({ msg: Item.notFound })
      }
    })
    .catch((err) => {
      console.log({ err })
      return res.status(500).json({ msg: ID.invalid })
    })
}

exports.create = async (req, res) => {
  const { isValid, errors } =  await validateItem(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }


  const item = new Item({
    ...req.body
  })

  await item
    .save()
    .then((result) => {
      res.json({ item })
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

  const { isValid, errors } = await validateItem(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }

  await Item.findOneAndUpdate({ _id: req.params.id }, req.body, {
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

  Item.findById(req.params.id)
    .then((item) => {
      if (item) {
        item
          .remove()
          .then(() => {
            return res.status(200).send(item)
          })
      } else {
        return res.status(404).json({ msg: item.notFound })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send({ msg: error.message })
    })
}
