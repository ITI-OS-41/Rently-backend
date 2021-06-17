const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const FAQSchema = new Schema({
  createdBy:{
    type: ObjectId,
    ref: "User",
    required: "user is required",
  },
  title: {
    type: String,
    required:true
  },
  description:{
      type:String,
      required:true
  }
})

FAQSchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in FAQSchema.obj) {
		if (FAQSchema.obj[required].required && required !== 'createdBy') {
			arr.push(required);
		}
	}
	return arr;
};

let autoPopulateLead = function (next) {
	this.populate('createdBy');
	next();
};

FAQSchema.pre('findOne', autoPopulateLead).pre('find', autoPopulateLead);

module.exports = mongoose.model("FAQ", FAQSchema)
