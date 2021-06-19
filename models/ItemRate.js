/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
//module.exports = mongoose.model('Item', itemSchema);

const itemRateSchema = new Schema(
	{
		item: {
			type: ObjectId,
			ref: "Item",
			required: true,
			index: true,
		},
		rater: {
			type: ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		comment: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
	},
	{ timestamps: true },
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

let autoPopulateLead = function (next) {
	this.populate("rater");
	next();
};

itemRateSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

itemRateSchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in itemRateSchema.obj) {
		if (
			itemRateSchema.obj[required].required &&
			required !== "rater" &&
			required !== "item"
		) {
			arr.push(required);
		}
	}
	return arr;
};

// let autoPopulateLead = function (next) {
// 	this.populate("rater");
// 	this.populate("item");
// 	next();
// };

// itemRateSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

itemRateSchema.index({ rater: 1, item: 1 }, { unique: true });

module.exports = mongoose.model("ItemRate", itemRateSchema);
