const Message = require("../models/Message");
const { conversationIdCheck } = require("../helpers/errors");

//add

exports.create = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get

exports.getAll = async (req, res) => {
  
  const idCheck = await conversationIdCheck(req.params.conversationId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
