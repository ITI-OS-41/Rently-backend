const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = require('mongoose').Types.ObjectId;


const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subcategory:{
    type:ObjectId,
    ref:"SubCategory"
  },
  description: {
    type: String,
    required: true,
  },
  
  photo: String,
}, { timestamps: true })



module.exports = mongoose.model("Category", categorySchema)
