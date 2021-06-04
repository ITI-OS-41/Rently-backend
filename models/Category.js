const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  created: {
		type: Date,
		default: Date.now,
	},
  photo: String,
})

module.exports = mongoose.model("Category", categorySchema)
