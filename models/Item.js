const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const itemSchema = new Schema(
  {
    owner:{
      type:ObjectId,
      ref: "User",
      required:true
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    condition: {
      type: String,
      enum: {
        values: ["perfect", "very good", "descent", "good", "fair"],
        message: '{VALUE} is not supported'     
       },
       default: "descent"

    },
    status:{
      type:Boolean,
      required:true
    },
    subcategory: {
      type: ObjectId,
      ref: "SubCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      type:String,
      required: true
    },
    instructionalVideo: {
      data: Buffer,
      contentType: String,
    },
    location: {
      type: {
        type: String,
        enum: {
          values: ["Point"],
          message: '{VALUE} is not supported',
        },
        default: "Point"
      },
      coordinates: [
        {
          type: Number,
          required: [true, "You must supply coordinates!"],
        },
      ],
      address: {
        type: String,
        required: [true, "You must supply an address!"],
      },
    },
    cancellation: {
      type: String,
      enum: {
        values: ["Easygoing", "Reasonable", "Strict"],
        message: '{VALUE} is not supported'
      },
      default: "Reasonable"
      
    },
    price: {
      hour: {
        type: Number,
      },
      day: {
        type: Number,
      },
      week: {
        type: Number,
      },
      month: {
        type: Number,
      },
    },
    deliverable: {
      type: Boolean,
      required: true,
    },
    deposit: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
