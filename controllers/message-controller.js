const Message = require("../models/Message");
const { validateId } = require("../helpers/errors");

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
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      hidden: false,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
