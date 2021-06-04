const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const rentSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  renter: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: ObjectId,
    // todo: remvoe comment after assem submit 
    // ref: "Item",
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  insurance: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

}, { timestamps: true })

module.exports = mongoose.model("Rent", rentSchema)
