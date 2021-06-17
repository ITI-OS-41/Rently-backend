/** @format */

const mongoose = require("mongoose");
const slug = require("slugs");
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "author is required"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "title is required"],
      minlength: [4, "title is really short, needed to be 4, got {VALUE}"],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
    },
    tags: [String],

    photo: {
      type: String,
      required: [true, "photo is required"],
    },
  },
  { timestamps: true }
);

// loop over el required fields and return an array

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
  // TODO make more resiliant so slugs are unique
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

blogSchema.statics.getTagList = function () {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

module.exports = mongoose.model("Blog", blogSchema);
