/** @format */
const {
  validateId,
  categoryIdCheck,
  blogIdCheck,
} = require("../helpers/errors");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const User = require("../models/User");

exports.createBlog = async (req, res) => {
  req.body.author = req.user.id;
  req.body.category = req.params.categoryId;

  const blog = await new Blog(req.body);
  try {
    const savedBlog = await blog.save();
    if (savedBlog) {
      return res.status(200).json(savedBlog);
    } else {
      return res.status(404).json({ msg: "blog not saved" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createComment = async (req, res) => {
  req.body.commenter = req.user.id;
  req.body.blogPost = req.params.blogId;
  const comment = await new Comment(req.body);
  try {
    const savedComment = await comment.save();
    if (savedComment) {
      await Blog.updateMany(
        { _id: comment.blogPost },
        { $push: { comments: comment._id } }
      );
      return res.status(200).json(savedComment);
    } else {
      return res.status(404).json({ msg: "Comment not saved" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOneBlog = async (req, res) => {
  const id = req.params.blogId;

  req.body.category = req.params.categoryId;
  const idCheck = await categoryIdCheck(req.params.categoryId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }

  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid id" });
  }
  try {
    const blog = await Blog.findById(id);
    if (blog) {
      return res.json(blog);
    } else {
      return res.status(404).json({ msg: "blog not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllBlogs = async (req, res) => {
  let { _id, title, category, slug, tags, description } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(title && { title: new RegExp(`${title}`) }),
    ...(description && { description: new RegExp(`${description}`) }),
    ...(category && { category: new RegExp(`${category}`) }),
    ...(slug && { slug }),
    ...(tags && { tags: new RegExp(tags.replace(/,/g, "|")) }),
  };
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;

  req.body.category = req.params.categoryId;
  const idCheck = await categoryIdCheck(req.params.categoryId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }

  try {
    const getPosts = await Blog.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    res.status(200).send({ res: getPosts, pagination: { limit, skip, page } });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllComments = async (req, res) => {
  let { body, commenter } = req.query;
  const id = req.params.blogId;

  const queryObj = {
    ...(body && { body: new RegExp(`${body}`) }),
    ...(commenter && { body: new RegExp(`${commenter}`) }),
  };
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;

  const idCheck = await blogIdCheck(req.params.blogId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }
  try {
    const getComments = await Comment.find({ blogPost: id })
      .find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);

    res
      .status(200)
      .send({ res: getComments, pagination: { limit, skip, page } });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

    const loggedUser = await User.findById(req.user.id);
    if (updatedBlog.author._id != req.user.id && loggedUser.role !== "admin") {
      return res
        .status(404)
        .json({ msg: "you are not authorized to perform this operation" });
    } else {
      return res.status(200).send(updatedBlog);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      req.body,
      {
        new: true,
      }
    );
    const loggedUser = await User.findById(req.user.id);
    if (
      updatedComment.commenter != req.user.id &&
      loggedUser.role !== "admin"
    ) {
      return res
        .status(404)
        .json({ msg: "you are not authorized to perform this operation" });
    } else {
      return res.status(200).send(updatedComment);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.deleteOneBlog = async (req, res) => {
  const id = req.params.blogId;
  req.body.category = req.params.categoryId;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  const idCheck = await categoryIdCheck(req.params.categoryId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }
  try {
    const deletedBlog = await Blog.findById(id);
    if (deletedBlog) {
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedBlog.author._id != req.user.id &&
        loggedUser.role !== "admin"
      ) {
        return res
          .status(404)
          .json({ msg: "you are not authorized to perform this operation" });
      } else {
        deletedBlog.remove().then(() => {
          return res.status(200).send(deletedBlog);
        });
      }
    } else {
      return res.status(404).json({ msg: "blog not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteOneComment = async (req, res) => {
  const id = req.params.commentId;
  req.body.blog = req.params.blogId;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid comment id" });
  }
  const idCheck = await blogIdCheck(req.params.blogId, res);
  if (Object.keys(idCheck).length > 0) {
    return res.status(404).json(idCheck);
  }
  try {
    const deletedComment = await Comment.findById(id);
    if (deletedComment) {
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedComment.commenter != req.user.id &&
        loggedUser.role !== "admin"
      ) {
        return res
          .status(404)
          .json({ msg: "you are not authorized to perform this operation" });
      } else {
        deletedComment.remove().then(() => {
          return res.status(200).send(deletedComment);
        });
      }
    } else {
      return res.status(404).json({ msg: "comment not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
