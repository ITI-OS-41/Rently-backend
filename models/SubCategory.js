/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slugs");
const ObjectId = require("mongoose").Types.ObjectId;

const subcategorySchema = new Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    faq: [{ type: ObjectId, ref: "Faq" }],
    name: {
      type: String,
      trim:true,
      required: true,
    },
    description: {
      type: String,
      trim:true,
      required: [true, "description is required"],
    },
    photo: {
      type: String,
      trim:true,
      required: [true, "photo is required"],
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    slug: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);
subcategorySchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  console.log(docToUpdate.slug);
  docToUpdate.slug = slug(docToUpdate.name);
  docToUpdate.save(); // The document that `findOneAndUpdate()` will modify
});
subcategorySchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make more resiliant so slugs are unique
});

subcategorySchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in subcategorySchema.obj) {
    if (subcategorySchema.obj[required].required && required !== "createdBy") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("faq", "-subCategory -category -createdAt -updatedAt -__v");
  this.populate("createdBy", "-email -password -createdAt -updatedAt -__v");
	this.populate(
    "category",
    "-subCategory -description -slug -photo -blogs -createdAt -updatedAt -__v"
  );
  next();
};

subcategorySchema
  .pre("findOne", autoPopulateLead)
  .pre("find", autoPopulateLead);

subcategorySchema.index({ name: 1, category: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", subcategorySchema);
