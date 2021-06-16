const mongoose = require("mongoose");
const Message = require("./Message");
const ObjectId = require("mongoose").Types.ObjectId;

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

conversationSchema.pre("remove", function (next) {
  Message.deleteMany({ conversationId: this._id }).exec();
  next();
});

module.exports = mongoose.model("Conversation", conversationSchema);
