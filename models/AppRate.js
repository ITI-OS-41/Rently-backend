const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const appRateSchema = new Schema(
  {
    rater: {
      type: ObjectId,
      ref: "User",
      required: [true, "rater is required"],
      unique: true,
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      trim:true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

appRateSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in appRateSchema.obj) {
    if (appRateSchema.obj[required].required && required !== "rater") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("rater", "-email -password -createdAt -updatedAt -__v");
  next();
};

appRateSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("AppRate", appRateSchema);
