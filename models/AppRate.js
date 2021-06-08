const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const appRateSchema = new Schema({
  rater: {
    type: ObjectId,
    ref: "User",
    required: true,
    index:true
  },
  
  site: {
    type: String,
    enum: {
      values: ["Rently"],
      message: '{VALUE} is not supported',
    },
    default: "Rently",
    required: true,
    index:true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true, 
    min: 1,
    max: 5,
  },
 
}, { timestamps: true })

appRateSchema.index({ rater: 1, site: 1 }, { unique: true });

module.exports = mongoose.model("AppRate", appRateSchema)
