/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const userRateSchema = new Schema(
	{
		renter: {
			type: ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		item: {
			type: ObjectId,
			ref: 'Item',
			required: true,
			index: true,
		},

		owner: {
			type: ObjectId,
			ref: 'User',
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
	{ timestamps: true }
);

let autoPopulateLead = function (next) {
	this.populate('renter');
	this.populate('item');
	this.populate('owner');
	next();
};

userRateSchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in userRateSchema.obj) {
		if (
			userRateSchema.obj[required].required &&
			required !== 'renter' &&
			required !== 'item' &&
			required !== 'owner'
		) {
			arr.push(required);
		}
	}
	return arr;
};

userRateSchema.pre('findOne', autoPopulateLead).pre('find', autoPopulateLead);

userRateSchema.index({ rater: 1, owner: 1, item: 1 }, { unique: true });

module.exports = mongoose.model('UserRate', userRateSchema);
