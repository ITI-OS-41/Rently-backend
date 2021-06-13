const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
    },
    default: "user"
  },
  photo: {
    data: Buffer,
    type: String,
    // required: true
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
}, { timestamps: true })

// Duplicate the ID field.
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
userSchema.virtual('name').get(function () {
  if (this.firstname || this.lastname) {
    return this.firstname || '' + ' ' + this.lastname || '';
  }
  return this.username;
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model("User", userSchema)
