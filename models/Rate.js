const mongoose = require("mongoose")
const Schema = mongoose.Schema
//module.exports = mongoose.model('Item', itemSchema);
const rateSchema = new Schema({
  item_id: {
    type: String,
    required: true,
    unique: true,
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
  // totalPoints: {
  //   type: Number,
  //   min: 5,
  //   max: 5,
  // },
})

module.exports = mongoose.model("Rate", rateSchema)
