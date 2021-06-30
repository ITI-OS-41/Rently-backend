/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    profilePhoto: {
      type: String,
      // required: true,
    },
    firstname: {
      type: String,
      trim: true,
      // required: true,
    },
    lastname: {
      type: String,
      trim: true,
      // required: true,
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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
    },
    wallet: {
      type: Number,
    },
    dateOfBirth: {
      type: Date,
      // required: [true, "date of birth is required"],
    },
    isVerified: {
      type: Boolean,
      trim: true,
      default: false,
    },
    blockedUsers: [{ type: ObjectId, ref: "User" }],
    store: {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      photo: {
        type: String,
      },
    },
    favoriteItems: [{ type: ObjectId, ref: "Item" }],
    verificationPhotos: [String],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.virtual("name").get(function () {
  if (this.firstname || this.lastname) {
    return (this.firstname || "") + " " + this.lastname;
  }
  return this.username;
});

// Ensure virtual fields are serialised.
userSchema.set("toJSON", {
  virtuals: true,
});

let autoPopulateLead = function (next) {
  this.populate(
    "favoriteItems",
    " -isPublished -createdAt -updatedAt -__v -location -category -subcategory -description -stock -deposit -cancellation -instructionalVideo"
  );
    this.populate("blockedUsers", "-email -password -createdAt -updatedAt -__v");

  next();
};

userSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("User", userSchema);
