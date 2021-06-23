const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slugs");
const { ObjectId } = mongoose.Schema.Types;


const faqSchema = new Schema({
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  questions: {
    question: {
      type: String,
      trim: true,
      required: true,
    },
    answer: {
      type: String,
      trim: true,
      required: true,
    },
  },
  category: {
    type: ObjectId,
    ref: "Cagtegory",
    required: [true, "faq category is required"],
  },
  subCategory: {
    type: ObjectId,
    ref: "SubCagtegory",
    required: [true, "faq Subcategory is required"],
  },

  slug: {
    type: String,
    trim: true,
  },
});
faqSchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  console.log(docToUpdate.slug);
  docToUpdate.slug = slug(docToUpdate.questions.question);
  docToUpdate.save(); // The document that `findOneAndUpdate()` will modify
});

faqSchema.pre("save", async function (next) {
  if (!this.isModified("questions.question")) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.questions.question);
  // find other stores that have a slug of wes, wes-1, wes-2
  // const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  // const postWithSlug = await this.constructor.find({ slug: slugRegEx });
  // if (postWithSlug.length) {
  //   this.slug = `${this.slug}-${postWithSlug.length + 1}`;
  // }
  next();
  // TODO make more resiliant so slugs are unique
});

faqSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in faqSchema.obj) {
    if (faqSchema.obj[required].required && required !== "createdBy") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("createdBy");
  this.populate("category");
  // this.populate("subCategory");
  //TODO: handle the problem of nested object Ids

  this.populate({path:"category", model:"Category"});
  // this.populate({path:"subCategory", model:"SubCategory"});
  // this.populate("subCategory");
  next();
};

faqSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);
faqSchema.index({ questions: 1, category: 1,slug:1 }, { unique: true });

module.exports = mongoose.model("Faq", faqSchema);
