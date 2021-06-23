/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateMessage = require("../validation/message");

// Import controllers
const {
  createOneMessage,
  getAllMessages,
} = require("../controllers/message-controller");
//add

router.post("/", auth, validateMessage, createOneMessage);

//get
router.get("/:conversationId", auth, getAllMessages);


module.exports = router;
