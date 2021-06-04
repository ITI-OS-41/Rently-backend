const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId;

//module.exports = mongoose.model('Item', itemSchema);
const rateSchema = new Schema({
  item_id: {
    type: String,
    required: true,
    unique: true,
  },
  rater: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  // item_id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Item',
  //     required: true,
  //   },
  ratingNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true })

module.exports = mongoose.model("Rate", rateSchema)
