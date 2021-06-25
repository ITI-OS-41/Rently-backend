const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: "Conversation",
      required: [true, "conversation id is required"],
    },
    sender: {
      type: ObjectId,
      ref: "User",
      required: [true, "sender is required"],
    },
    text: {
      type: String,
      required: [true, "message content is required"],
    },
    // hidden:{
    //   type:Boolean,
    //   default:false
    // },
    // deletedBy:{
    //   type:ObjectId,
    //   ref: "User"
    // }
  },
  { timestamps: true }
);

messageSchema.statics.requiredFields = function () {
  let arr = [];
  for (let required in messageSchema.obj) {
    if (messageSchema.obj[required].required && required !== "sender") {
      arr.push(required);
    }
  }
  return arr;
};

let autoPopulateLead = function (next) {
  this.populate("conversationId");
  this.populate("sender");
  next();
};

messageSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("Message", messageSchema);
