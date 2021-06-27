const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const Notification = require("./Notification")
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

// messageSchema.post("save", async function (next) {
//  console.log(this.sender)

//   const notification = new Notification({
//     receiver: this.sender,
//     content: "you have a new renting request",
//     type:"rent",
//     isRead:false,
//   });
// try{
//  const savedNotification= await notification.save()
//     if(savedNotification){
//       console.log("saved",{savedNotification})
//     }else{
//       console.log("Failed")
//     }
//   }catch(error){
//        console.log({error} );
//   }
// });


let autoPopulateLead = function (next) {
  this.populate("conversationId");
  this.populate("sender");
  next();
};

messageSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("Message", messageSchema);
