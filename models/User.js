/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Rent = require("./Rent");

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
    photo: {
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
      // required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      // required: [true, "date of birth is required"],
    },
    isVerified: {
      type: Boolean,
      trim:true,
    },
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
if (Rent.status==="returned"){
  userSchema.pre("remove", function (next) {
    Category.deleteMany({ createdBy: this._id }).exec();

    next();
  });
};
module.exports = mongoose.model("User", userSchema);
