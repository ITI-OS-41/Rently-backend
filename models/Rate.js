const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;
//module.exports = mongoose.model('Item', itemSchema);

const rateSchema = new Schema({
  item: {
    type: String,
    required: true,
    index:true
  },
  
  rater: {
    type: ObjectId,
    ref: "User",
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

rateSchema.index({ rater: 1, item: 1 }, { unique: true });

module.exports = mongoose.model(" Rate", rateSchema)
