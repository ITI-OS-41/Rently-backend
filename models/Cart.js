const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slugs");
const ObjectId = require("mongoose").Types.ObjectId;
const SubCategory = require("./SubCategory");
const Item = require("./Item");
const Faq = require("./Faq");
const Blog = require("./Blog");
const cartSchema = new Schema(
  {
    item: {
      type: ObjectId,
      ref: "Item",
      required: [true, "item is required"],
    },
    rent: {
      type: ObjectId,
      ref: "Rent",
      required: [true, "rent is required"],
    },
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

cartSchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.slug = slug(docToUpdate.name);
  docToUpdate.save(); // The document that `findOneAndUpdate()` will modify
});
cartSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make more resiliant so slugs are unique
});

cartSchema.pre("remove", async function (next) {
  await Item.deleteMany({ category: this._id }).exec();
  await Faq.deleteMany({ category: this._id }).exec();
  await Blog.deleteMany({ category: this._id }).exec();
  await SubCategory.deleteMany({ category: this._id }).exec();
  next();
});

cartSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in cartSchema.obj) {
    if (cartSchema.obj[required].required && required !== "createdBy") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("createdBy", "-email -password -createdAt -updatedAt -__v");
  this.populate("subCategory", "-category -createdAt -updatedAt -__v");
  this.populate(
    "blogs",
    "-comments -bodyPhotos -description -slug -tags -headerPhoto -category -createdAt -updatedAt -__v"
  );
  next();
};

cartSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

cartSchema.index({ name: 1, model: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
