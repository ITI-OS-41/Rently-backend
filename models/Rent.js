const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const rentSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },
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
    from: {
      type: Date,
      required: [true, "start date is required"],
    },
    to: {
      type: Date,
      required: [true, "end date is required"],
    },
    insurance: {
      type: Number,
      trim: true,
      required: [true, "insurance is required"],
    },
    totalPrice: {
      type: Number,
      trim: true,
      required: [true, "rent price is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "delivered", "returned", "declined"],
        message: "{VALUE} is not supported",
      },
      required: [true, "rent status is required"],
    },
  },
  { timestamps: true }
);

rentSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in rentSchema.obj) {
    if (rentSchema.obj[required].required && required !== "renter") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("renter", "-email -password -createdAt -updatedAt -__v");
  this.populate("owner", "-email -password -createdAt -updatedAt -__v");
  this.populate(
    "item",
    "-isAvailable -isPublished -isDeliverable -createdAt -updatedAt -__v -location -category -subcategory -description -photo -stock -condition -deposit -cancellation -instructionalVideo"
  );
  next();
};

rentSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("Rent", rentSchema);
