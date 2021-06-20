const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongoose").Types.ObjectId;
const SubCategory = require("./SubCategory");
const Item = require("./Item")
const Faq = require("./Faq")
const Blog = require("./Blog");
const categorySchema = new Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: "user is required",
    },
    name: {
      type: String,
      required: true,
      index:true
    },
    subcategory: [{ type: ObjectId, ref: "SubCategory" }],
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: "item",
      index:true
    }
  },
  { timestamps: true }
);

// categorySchema.post("findOneAndUpdate", async function () {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log(docToUpdate.slug);
//   docToUpdate.slug = slug(docToUpdate.name);
//   docToUpdate.save(); // The document that `findOneAndUpdate()` will modify
// });

categorySchema.pre("remove", function (next) {
  SubCategory.deleteMany({ category: this._id }).exec();
  Item.deleteMany({ category: this._id }).exec();
  Faq.deleteMany({ category: this._id }).exec();
  Blog.deleteMany({ category: this._id }).exec();
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
  this.populate("createdBy");
  this.populate("subCategory");
  next();
};

categorySchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

categorySchema.index({ name: 1, model: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
