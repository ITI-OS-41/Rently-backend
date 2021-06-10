/** @format */

const mongoose = require('mongoose');
const slug = require('slugs');
const { ObjectId } = mongoose.Schema.Types;


const blogSchema = new mongoose.Schema({
	author:{
		type:ObjectId,
		ref: "User",
		required: true
	},
	title: {
		type: String,
		trim: true,
		required: 'Please enter a store name!',
	},
	slug: String,
	description: {
		type: String,
		trim: true,
		required: true
	},
	tags: [String],

	photo: {
		data: Buffer,
		type:String,
		// required: true
	  } ,
}, { timestamps: true });

blogSchema.pre('save', async function (next) {
	if (!this.isModified('title')) {
		next(); // skip it
		return; // stop this function from running
	}
	this.slug = slug(this.title);
	// find other stores that have a slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	console.log(slugRegEx);
	const postWithSlug = await this.constructor.find({ slug: slugRegEx });
	console.log(postWithSlug)
	if (postWithSlug.length) {
		this.slug = `${this.slug}-${postWithSlug.length + 1}`;
	}
	next();
	// TODO make more resiliant so slugs are unique
});

blogSchema.statics.getTagList = function () {
	return this.aggregate([
		{ $unwind: '$tags' },
		 { $group: { _id: '$tags', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
	]);
};

module.exports = mongoose.model('Blog', blogSchema);
