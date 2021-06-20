/** @format */

const mongoose = require("mongoose");
const slug = require("slugs");
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = new mongoose.Schema(
	{
		author: {
			type: ObjectId,
			ref: "User",
			required: "author is required",
		},
		title: {
			type: String,
			trim: true,
			required: "title is required",
			minlength: 4,
		},
		slug: {
			type: String,
			unique: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		tags: [String],

		photo: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);


blogSchema.pre("save", async function (next) {
	if (!this.isModified("title")) {
		next(); // skip it
		return; // stop this function from running
	}

	this.slug = slug(this.title);
	// find other stores that have a slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
	const postWithSlug = await this.constructor.find({ slug: slugRegEx });
	if (postWithSlug.length) {
		this.slug = `${this.slug}-${postWithSlug.length + 1}`;
	}
	next();
});

blogSchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in blogSchema.obj) {
		if (blogSchema.obj[required].required && required !== "author") {
			arr.push(required);
		}
	}
	return arr;
};

let autoPopulateLead = function (next) {
	this.populate("author");
	next();
};

blogSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("Blog", blogSchema);
