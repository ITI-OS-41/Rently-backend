const mongoose = require("mongoose");
const Message = require("./Message");
const ObjectId = require("mongoose").Types.ObjectId;

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "User",
      required: [true, "sender is required"],
      index: true,
    },
    receiver: {
      type: ObjectId,
      ref: "User",
      required: [true, "receiver is required"],
      index: true,
    },
    //
  },
  { timestamps: true }
);

conversationSchema.pre("remove", function (next) {
  Message.deleteMany({ conversationId: this._id }).exec();
  next();
});

conversationSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in conversationSchema.obj) {
    if (conversationSchema.obj[required].required && required !== "sender") {
      arr.push(required);
      console.log({ required });
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("sender");
  this.populate("receiver");
  next();
};

conversationSchema
  .pre("findOne", autoPopulateLead)
  .pre("find", autoPopulateLead);

conversationSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);
