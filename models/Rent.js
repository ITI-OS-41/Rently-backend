const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const rentSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  renter: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: ObjectId,
    ref: "Item",
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  insurance: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
      enum: {
        values: ["pending", "approved", "delivered", "returned","declined"],
        message: '{VALUE} is not supported'     
       },
       default: "pending"    
  }

}, { timestamps: true })

let autoPopulateLead = function (next) {
  this.populate("renter");
  this.populate("owner");
  this.populate("item");
  next();
};

rentSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);
// Duplicate the ID field.
rentSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
rentSchema.set('toJSON', {
  virtuals: true,

});


module.exports = mongoose.model("Rent", rentSchema)
