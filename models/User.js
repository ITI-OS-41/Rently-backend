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
    location: {
      type: {
        type: String,
        enum: {
          values: ["Point"],
          message: "{VALUE} is not supported",
        },
        default: "Point",
      },
      coordinates: [
        {
          type: Number,
          trim: true,
          //   required: [true, "You must supply coordinates!"],
        },
      ],
      address: {
        type: String,
        // required: [true, "You must supply an address!"],
      },
    },
    blockedUsers: [{ type: ObjectId, ref: "User" }],
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
  next();
};

userSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);
module.exports = mongoose.model("User", userSchema);
