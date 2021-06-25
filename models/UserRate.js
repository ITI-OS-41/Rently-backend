/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const userRateSchema = new Schema(
  {
    renter: {
      type: ObjectId,
      ref: "User",
      required: [true, "renter is required"],
    },

    item: {
      type: ObjectId,
      ref: "Item",
      required: [true, "item is required"],
    },

    owner: {
      type: ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

let autoPopulateLead = function (next) {
  this.populate("renter", "-email -password -createdAt -updatedAt -__v");
  this.populate(
    "item",
    "-isAvailable -isPublished -deliverable -createdAt -updatedAt -__v -location -category -subcategory -description -photo -stock -condition -deposit -cancellation -itemRate -instructionalVideo"
  );
  this.populate("owner", "-email -password -createdAt -updatedAt -__v");
  next();
};

userRateSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in userRateSchema.obj) {
    if (userRateSchema.obj[required].required && required !== "owner") {
      arr.push(required);
    }
  }
  return arr;
};

userRateSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

userRateSchema.index({ rater: 1, owner: 1, item: 1 }, { unique: true });

module.exports = mongoose.model("UserRate", userRateSchema);
