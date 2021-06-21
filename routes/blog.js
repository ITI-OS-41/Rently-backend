/** @format */
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const router = require("express").Router();
const validateComment = require("../validation/comment");
// Import controllers
const {
  createComment,
  getAllComments,
  updateComment,
  deleteOneComment,
} = require("../controllers/blog-controller");



// * create comment
router.post("/:blogId/comment", auth,validateComment, createComment);

// * GET ALL Blog Comments
router.get("/:blogId/comment", auth, getAllComments);

// * UPDATE Comment
router.post("/:blogId/comment/:commentId",auth, validateComment, updateComment);


// * DELETE Comment
router.delete("/:blogId/comment/:commentId",auth, deleteOneComment);

module.exports = router;
