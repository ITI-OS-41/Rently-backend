/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new Schema(
	{
		receiver: {
			type: ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			// required: true,
			default:"rent",
		},
		conversation: {
			type: ObjectId,
			ref: 'Conversation',
		},
		isRead:{
			type:Boolean,
			default:false,
		},

		content: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

let autoPopulateLead = function (next) {
	this.populate('sender');
	this.populate('receiver');
	next();
};

notificationSchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in notificationSchema.obj) {
		if (
			notificationSchema.obj[required].required 
			// required !== 'sender' &&
			// required !== 'receiver'
		) {
			arr.push(required);
		}
	}
	return arr;
};

notificationSchema
	.pre('findOne', autoPopulateLead)
	.pre('find', autoPopulateLead);

module.exports = mongoose.model('Notification', notificationSchema);
