/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateComment = require("../validation/comment");


// Import controllers
const {
  createOneComment,
  getOneComment,
  getAllComments,
  updateOneComment,
  deleteOneComment,
} = require("../controllers/blog-controller");



// * create a blog comment
router.post("/", auth,validateComment, createOneComment);

// * GET One Blog Comment
router.get("/:id",  getOneComment );

// * GET ALL Blog Comments
router.get("/",  getAllComments);

// * UPDATE ONE Comment
router.post("/:id",auth, validateComment, updateOneComment);

// * DELETE ONE Comment
router.delete(":id",auth, deleteOneComment);

module.exports = router;
