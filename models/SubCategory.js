/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require("mongoose").Types.ObjectId;
const Faq = require("./Faq")

const subcategorySchema = new Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: "user is required",
    },
    faq: [{ type: ObjectId, ref: "Faq" }],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    photo: String,
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);


subcategorySchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in subcategorySchema.obj) {
		if (subcategorySchema.obj[required].required && required !== 'createdBy') {
			arr.push(required);
		}
	}
	return arr;
};

let autoPopulateLead = function (next) {
	this.populate('faq',"-subCategory -category -createdAt -updatedAt -__v");
	this.populate('createdBy',"-email -password -createdAt -updatedAt -__v");
	next();
};

subcategorySchema
	.pre('findOne', autoPopulateLead)
	.pre('find', autoPopulateLead);


subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('SubCategory', subcategorySchema);
