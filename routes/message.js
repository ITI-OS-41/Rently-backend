/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const Message = require("../models/Message");
const passport = require("passport");
const validateMessage = require("../validation/message");

// Import controllers
const {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
  getByTag,
} = require("../controllers/message-controller");
//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
