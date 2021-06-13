const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = require('mongoose').Types.ObjectId;


const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    index:true
  },
  description: {
    type: String,
    required: true,
  },
  photo: String,
  category:{
    type: ObjectId,
    ref:"Category",
    required: true,
    index:true
  },
}, { timestamps: true })

subcategorySchema.index({ rater: 1, item: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", subcategorySchema)
