/** @format */
const auth = require("../middleware/auth")
const router = require("express").Router();
const validateConversation= require("../validation/conversation")
const {
  getOne,
  getAll,
  deleteOne,
  create,
} = require("../controllers/conversation-controller");

//new conv

router.put("/",auth,validateConversation, create);

//get conv of a user

// TODO:get conversation of logged in user
router.get("/",auth, getAll);

// get conv includes two userId
router.get("/:id", auth, getOne);

router.delete("/:id", auth, deleteOne );

module.exports = router;
