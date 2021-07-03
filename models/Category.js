const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slugs");
const ObjectId = require("mongoose").Types.ObjectId;
const SubCategory = require("./SubCategory");
const Item = require("./Item");
const Faq = require("./Faq");
const Blog = require("./Blog");
const categorySchema = new Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    name: {
      type: String,
      required: true,
    },
    subcategory: [{ type: ObjectId, ref: "SubCategory" }],
    description: {
      type: String,
      required: [true, "description is required"],
    },
    photo: {
      type: String,
      required: [true, "photo is required"],
    },
    model: {
      type: String,
      required: [true, "model is required"],
    },
    slug: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

categorySchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.slug = slug(docToUpdate.name);
  docToUpdate.save(); // The document that `findOneAndUpdate()` will modify
});
categorySchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make more resiliant so slugs are unique
});

categorySchema.pre("remove", async function (next) {
  await Item.deleteMany({ category: this._id }).exec();
  await Faq.deleteMany({ category: this._id }).exec();
  await Blog.deleteMany({ category: this._id }).exec();
  await SubCategory.deleteMany({ category: this._id }).exec();
  next();
});

categorySchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in categorySchema.obj) {
    if (categorySchema.obj[required].required && required !== "createdBy") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("createdBy", "-email -password -createdAt -updatedAt -__v");
  this.populate("subCategory", "-category -createdAt -updatedAt -__v");
  next();
};

categorySchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

categorySchema.index({ name: 1, model: 1, slug: 1 }, { unique: true });


module.exports = mongoose.model("Category", categorySchema);
