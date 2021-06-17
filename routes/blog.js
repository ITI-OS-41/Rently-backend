/** @format */
const auth = require("../middleware/auth");
const router = require("express").Router();
const Blog = require("../models/Blog");
const passport = require("passport");
const { catchErrors } = require("../helpers/errors");
const validateBlog = require("../validation/blog");
// Import controllers
const {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
  getByTag,
} = require("../controllers/blog-controller");
// * create blog

router.post("/", auth, validateBlog, catchErrors(create));
// * GET ONE
router.get("/:id", getOne);

// * GET ALL
router.get("/", catchErrors(getAll));

// * UPDATE
router.post("/:id", validateBlog, catchErrors(update));

// * DELETE
router.delete("/:id", deleteOne);

// * Find by slug name
// router.get("/slug/:slug", getBySlug);

// * Find by  tag
// router.get('/tag', getByTag);
// router.get('/tag/:tag', getByTag);
module.exports = router;
