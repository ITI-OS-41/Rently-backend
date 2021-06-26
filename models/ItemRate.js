/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const itemRateSchema = new Schema(
  {
    item: {
      type: ObjectId,
      ref: "Item",
      required: [true, "item is required"],
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
      trim: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);



itemRateSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in itemRateSchema.obj) {
    if (itemRateSchema.obj[required].required && required !== "rater") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("rater", "-email -password -createdAt -updatedAt -__v");
  next();
  this.populate(
    "item",
    "-isAvailable -isPublished -isDeliverable -createdAt -updatedAt -__v -location -category -subcategory -description -photo -stock -condition -deposit -cancellation -instructionalVideo"
  );
};

itemRateSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

itemRateSchema.index({ rater: 1, item: 1 }, { unique: true });

module.exports = mongoose.model("ItemRate", itemRateSchema);
