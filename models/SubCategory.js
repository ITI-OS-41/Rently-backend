const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongoose").Types.ObjectId;

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: String,
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);



var autoPopulateLead = function (next) {
  this.populate('category');
  next();
};

subcategorySchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);


// Duplicate the ID field.
subcategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
subcategorySchema.set('toJSON', {
  virtuals: true,
});



subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", subcategorySchema);
