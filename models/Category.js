const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongoose").Types.ObjectId;
const SubCategory = require("../models/SubCategory");
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subcategory: [{ type: ObjectId, ref: "SubCategory" }],
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);
categorySchema.pre("remove", function (next) {
  SubCategory.deleteMany({ category: this._id }).exec();
  next();
});
module.exports = mongoose.model("Category", categorySchema);
