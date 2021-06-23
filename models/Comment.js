/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    commenter: {
      type: ObjectId,
      ref: "User",
      required: [true, "commenter is required"],
    },
    body: {
      type: String,
      trim: true,
      required: [true, "title is required"],
    },
    blogPost: {
      type: ObjectId,
      ref: "Blog",
      required: [true, "blogPost id is required"],
    },
  },
  { timestamps: true }
);

commentSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in commentSchema.obj) {
    if (
      commentSchema.obj[required].required &&
      required !== "commenter" 
        ) {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("commenter", "-email -password -createdAt -updatedAt -__v");
  this.populate("blogPost", "-slug -description -tags -headerPhoto -bodyPhotos -category -createdAt -updatedAt -__v");
  next();
};

commentSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("Comment", commentSchema);
