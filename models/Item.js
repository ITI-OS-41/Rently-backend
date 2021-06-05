const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const itemSchema = new Schema({
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: String,
}, { timestamps: true })

module.exports = mongoose.model("Item", itemSchema)
