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
      index: true,
      required: [true, "title is required"],
      minlength: [4, "title is really short, needed to be 4, got {VALUE}"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
    },
    tags: [String],
    headerPhoto: {
      type: String,
      required: [true, "Header photo is required"],
    },
    bodyPhotos: [String],
    comments: [{ type: ObjectId, ref: "Comment" }],
    category: {
      type: ObjectId,
      ref: "Cagtegory",
      required: [true, "faq category is required"],
    },
  },
  { timestamps: true }
);

// blogSchema.statics.getCategoryList = function () {
//   return this.aggregate([{ $group: { _id: "$category" } }]);
// };

blogSchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  console.log(docToUpdate);
  // The document that `findOneAndUpdate()` will modify
});

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
// loop over el required fields and return an array
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
  this.populate("comments");

  next();
};

blogSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

blogSchema.index({ title: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Blog", blogSchema);
