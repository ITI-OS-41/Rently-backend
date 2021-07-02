const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { conversationIdCheck } = require("../helpers/errors");

//add

exports.createOneMessage = async (req, res) => {
  req.body.sender = req.user.id;
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { _id: req.body.conversationId },
      { updatedAt: new Date.now() },
      { new: true }
    );
    return res.status(200).json(savedMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//get

exports.getAllMessages = async (req, res) => {
  req.body.sender = req.user.id;
  const idCheck = await conversationIdCheck(req.params.conversationId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  } else {
    const checkSender = await Conversation.find({
      _id: req.params.conversationId,
      members: { $in: [req.body.sender] },
    });
    if (!checkSender.length) {
      return res
        .status(403)
        .json({ msg: "sender is not part of the requested conversation " });
    }
  }
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json(err);
  }
};
