const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongoose").Types.ObjectId;
const cartSchema = new Schema(
  {
    
    rent: [{
      type: ObjectId,
      ref: "Rent",
      required: [true, "rent is required"],
    }],
    renter: {
      type: ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    orderTotal: {
      type: Number,
      required: [true, "order Total price is required"],
    },
  },
  { timestamps: true }
);

cartSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in cartSchema.obj) {
    if (cartSchema.obj[required].required && required !== "renter") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("renter", "-email -password -createdAt -updatedAt -__v");
  this.populate(
    "item",
    "-isAvailable -isPublished -isDeliverable -createdAt -updatedAt -__v -location -category -subcategory -description -photo -condition -deposit -cancellation -instructionalVideo"
  );
  this.populate("rent", "-insurance -status -createdAt -updatedAt -__v");
  next();
};

cartSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

cartSchema.index({ item: 1, renter: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
