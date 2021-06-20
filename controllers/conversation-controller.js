const Conversation = require("../models/Conversation");

//new conv

exports.create= async (req, res) => {
  req.body.sender= req.user.id
  const newConversation = new Conversation(req.body);

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get conv of a user

exports.getAll= async (req, res) => {
  try {
    const conversation = await Conversation.find({
      sender: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get conv includes two userId

exports.getOne= async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      sender: { $in: [req.params.firstUserId] },
      receiver: { $in: [req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete=async (req, res) => {
  const id = req.params.id;

  Conversation.findById(req.params.id)
    .then((conversation) => {
      if (conversation) {
        conversation.remove().then(() => {
          return res.status(200).send(conversation);
        });
      } else {
        return res.status(404).json({ msg: "conversation not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: "bad server" });
    });
};

