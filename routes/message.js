/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateMessage = require("../validation/message");

// Import controllers
const {
  create,
  getAll,
} = require("../controllers/message-controller");
//add

router.post("/", auth, validateMessage, create);

//get
router.get("/:conversationId", auth, getAll);

module.exports = router;
