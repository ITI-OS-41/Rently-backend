/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slugs");
const { ObjectId } = mongoose.Schema.Types;
const itemSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    condition: {
      type: String,
      enum: {
        values: ["perfect", "very good", "descent", "good", "fair"],
        message: "{VALUE} is not supported",
      },
      required: [true, "item condition is required"],
    },
    isAvailable: {
      type: Boolean,
      trim: true,
      required: [true, "item availability status is required"],
    },
    isSubmitted: {
      type: Boolean,
      trim: true,
      required: [true, "item submission status is required"],
    },
    isPublished: {
      type: Boolean,
      trim: true,
      required: [true, "item published status is required"],
    },
    isFavorite: {
      type: Boolean,
      trim: true,
    },
    subcategory: {
      type: ObjectId,
      ref: "SubCategory",
      required: [true, "subCategory is required"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "item name is required"],
    },
    stock: {
      type: Number,
      trim: true,
      required: [true, "stock is required"],
    },
    description: {
      type: String,
      required: [true, "item description is required"],
    },
    photo: {
      type: [String],
      required: [true, "item photos are required"],
    },
    instructionalVideo: {
      type: [String],
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
    cancellation: {
      type: String,
      trim: true,
      enum: {
        values: ["easygoing", "reasonable", "strict"],
        message: "{VALUE} is not supported",
      },
      required: [true, "item cancellation is required"],
    },
    price: {
      day: {
        type: Number,
        trim: true,
        default: 0,
      },
      week: {
        type: Number,
        trim: true,
        default: 0,
      },
      month: {
        type: Number,
        trim: true,
        default: 0,
      },
    },
    isDeliverable: {
      type: Boolean,
      trim: true,
      required: [true, "item delivery option required"],
    },
    deposit: {
      type: Number,
      trim: true,
      required: [true, "item deposit is required"],
    },
    // itemRate: [{ type: ObjectId, ref: "ItemRate" }],
    slug: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

itemSchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.slug = slug(docToUpdate.name);
  docToUpdate.save(); // The document that `findOneAndUpdate()` will modify
});
itemSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make more resiliant so slugs are unique
});

itemSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in itemSchema.obj) {
    if (itemSchema.obj[required].required && required !== "owner") {
      arr.push(required);
    }
  }
  arr.push("price");
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("owner", "-email -password -createdAt -updatedAt -__v");
  this.populate(
    "category",
    "-subcategory -blogs -description -photo -createdAt -updatedAt -__v"
  );
  this.populate(
    "subcategory",
    "-category -description -slug -createdAt -updatedAt -__v"
  );

  next();
};

itemSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

itemSchema.index({ name: 1, owner: 1, slug: 1 }, { unique: true });
module.exports = mongoose.model("Item", itemSchema);
