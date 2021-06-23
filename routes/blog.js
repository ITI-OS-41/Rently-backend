/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const validateBlog = require("../validation/blog");


// Import blog controllers
const {
  createOneBlog,
  getAllBlogs,
  getOneBlog,
  updateOneBlog,
  deleteOneBlog,
} = require("../controllers/blog-controller");



//****************** 
//*blog routes
//****************

// * create blog
router.post("/", auth, validateBlog, createOneBlog);
// * GET ONE Blog
router.get("/:id",getOneBlog);
// * GET ALL Blogs
router.get("/",getAllBlogs);
// * UPDATE Blog
router.post("/:id", auth, validateBlog, updateOneBlog);
// * DELETE Blog
router.delete("/:id", auth, deleteOneBlog);





module.exports = router;
