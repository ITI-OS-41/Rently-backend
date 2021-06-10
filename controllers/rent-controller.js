const Rent = require("../models/Rent")
import { RENT, ID } from "../helpers/errors"
import {validateId} from "../helpers/errors"


 
exports.getAll = async (req, res) => {


  let { _id, owner, renter, status, rating } = req.query
  const queryObj = {
    ...(_id && { _id }),
    ...(owner && { owner }),
    ...(renter && { renter }),
    ...(status && { status }),
    ...(rating && { rating }),
  }

  // * ...(email && { email: /regex here/ }),

  await Rent.find(queryObj)
    .then((objects) => {
      res.status(200).send(objects)
    })
}

exports.getOne = (req, res) => {
  const id = req.params.id
  validateId(id,res)
  
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

  const rent = await new Rent(req.body).save();
	res.status(200).send(rent);

  
  // await rent
  //   .save()
    // .then((result) => {
    //   res.json({ rent })
    // })
    // .catch((err) => {
    //   console.log(err)
    //   return res.status(500).send({ msg: err.message })
    // })
}


exports.update = async (req, res) => {
  
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
  validateId(id,res)

  Rent.findById(id)
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
