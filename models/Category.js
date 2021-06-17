const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongoose").Types.ObjectId;
const SubCategory = require("./SubCategory");

const categorySchema = new Schema(
  {
    createdBy:{
      type: ObjectId,
      ref: "User",
      required: "user is required",
    },
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
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("remove", function (next) {
  SubCategory.deleteMany({ category: this._id }).exec();
  next();
});

categorySchema.statics.requiredFields = function () {
	let arr = [];
	for (let required in categorySchema.obj) {
		if (categorySchema.obj[required].required && required !== 'createdBy') {
			arr.push(required);
		}
	}
	return arr;
};


let autoPopulateLead = function (next) {
	this.populate('createdBy');
	this.populate('subCategory');
	next();
};

categorySchema.pre('findOne', autoPopulateLead).pre('find', autoPopulateLead);

module.exports = mongoose.model("Category", categorySchema);
