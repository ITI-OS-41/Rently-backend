/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const { catchErrors } = require("../helpers/errors");
const validateBlog = require("../validation/blog");
// Import controllers
const {
  getAllCategories,
  createBlog,
  createComment,
  getAllBlogs,
  getAllComments,
  getOneBlog,
  updateBlog,
  updateComment,
  deleteOneBlog,
  deleteOneComment,
} = require("../controllers/blog-controller");

// * create comment

router.post("/:blogId/comment", auth, catchErrors(createComment));

// * create blog
router.post("/", auth, validateBlog, catchErrors(createBlog));
// * GET ONE Blog
// router.get("/:id", getOneBlog);

// * GET ALL Blogs
router.get("/", catchErrors(getAllBlogs));

// * GET ALL Blog Comments
router.get("/:blogId/comment", catchErrors(getAllComments));

// * GET ALL Blog Categories
router.get("/categories", catchErrors(getAllCategories));

// * UPDATE Blog
router.post("/:id", validateBlog, catchErrors(updateBlog));

// * UPDATE Comment
router.post(
  "/:blogId/comment/:commentId", catchErrors(updateComment)
);

// * DELETE Blog
router.delete("/:id", deleteOneBlog);

// * DELETE Comment
router.delete("/:blogId/comment/:commentId", deleteOneComment);


module.exports = router;
