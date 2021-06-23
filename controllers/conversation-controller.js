const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { validateId } = require("../helpers/errors");
//new conv

exports.create = async (req, res) => {
  req.body.sender = req.user.id;
  const newConversation = new Conversation({
    members: [req.body.sender, req.body.members],
  });
  try {
    const savedConversation = await newConversation.save();
    if (savedConversation) {
      return res.status(200).json(savedConversation);
    } else {
      return res.status(404).json({ msg: "conversation not saved" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// get conv includes two userId
exports.getOne = async (req, res) => {
  if (validateId(req.params.id, res)) {
    return res.status(404).json({ msg: "invalid conversation id" });
  }
  const loggedUser = await User.findById(req.user.id);
  try {
    const conversation = await Conversation.findById({
      _id: req.params.id,
    });

    if (conversation) {
      if (
        conversation.members[0]._id == req.user.id ||
        conversation.members[1]._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        return res.status(200).json(conversation);
      } else {
        return res.status(403).json({ msg: "unauthorized resources access" });
      }
    } else {
      return res.status(404).json({ msg: "conversation not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

//get conversations of a user
exports.getAll = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user.id] },
    });
    if (conversation.length) {
      return res.status(200).json(conversation);
    } else {
      return res.status(404).json({ msg: "no conversation found for this user" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteOne = async (req, res) => {
  const id = req.params.id;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid id" });
  }
  try {
    const conversation = await Conversation.findById(id);
    if (conversation) {
      const loggedUser = await User.findById(req.user.id);

      if (
        conversation.members[0] == req.user.id ||
        conversation.members[1] == req.user.id ||
        loggedUser.role === "admin"
      ) {
        conversation.remove().then(() => {
          return res.status(200).send(conversation);
        });
      } else {
        return res
          .status(404)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "conversation not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
// const messages = await Message.updateMany(
//   {
//     conversationId: req.params.conversationId,
//   },
//   { $set: { hidden: true, deletedBy: req.user.id } }
// );
// res.status(200).json(messages)
