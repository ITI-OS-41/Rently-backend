const mongoose = require("mongoose")
const Schema = mongoose.Schema

const subcategorySchema = new Schema({
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
  parentCategory:{
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("SubCategory", subcategorySchema)
