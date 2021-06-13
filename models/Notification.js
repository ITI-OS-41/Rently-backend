const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new Schema({
  receiver: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true })


var autoPopulateLead = function (next) {
  this.populate('sender');
  this.populate('receiver');
  next();
};

notificationSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

// Duplicate the ID field.
notificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
notificationSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model("Notification", notificationSchema)
