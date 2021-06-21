/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const { catchErrors } = require("../helpers/errors");
const validateCategory = require("../validation/category");
const validateBlog = require("../validation/blog");
// Import controllers
const {
  getOne,
  getAll,
  update,
  deleteOne,
  create,
} = require("../controllers/category-controller");

const {
  createBlog,
  getAllBlogs,
  getOneBlog,
  updateBlog,
  deleteOneBlog,
} = require("../controllers/blog-controller");
//****************** 
//*blog routes
//****************

// * create blog
router.post("/:categoryId/blog", auth, validateBlog, createBlog);
// * GET ONE Blog
router.get("/:categoryId/blog/:blogId", auth,getOneBlog);
// * GET ALL Blogs
router.get("/:categoryId/blog", auth,getAllBlogs);
// * UPDATE Blog
router.post("/:categoryId/blog/:blogId", auth, validateBlog, updateBlog);
// * DELETE Blog
router.delete("/:categoryId/blog/:blogId", auth, deleteOneBlog);


//*******************
//* category routes
//*******************

//  * Create New

router.post("/", auth, validateCategory, catchErrors(create));
// * GET ONE
router.get("/:id", catchErrors(getOne));
// * GET ALL
router.get("/", catchErrors(getAll));
// * UPDATE
router.post("/:id", auth, validateCategory, catchErrors(update));
// * DELETE
router.delete("/:id", catchErrors(deleteOne));

module.exports = router;
