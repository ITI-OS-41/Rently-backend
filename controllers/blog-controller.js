/** @format */
const {
  validateId,
} = require("../helpers/errors");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const User = require("../models/User");
const Category = require("../models/Category");

exports.createOneBlog = async (req, res) => {
  req.body.author = req.user.id;
  const blog = await new Blog(req.body);
  try {
    const savedBlog = await blog.save();
    if (savedBlog) {
      await Category.updateMany(
        { _id: savedBlog.category },
        { $push: { blogs: savedBlog._id } }
      );
      return res.status(200).json(savedBlog);
    } else {
      return res.status(404).json({ msg: "blog not saved" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createOneComment = async (req, res) => {
  req.body.commenter = req.user.id;
  const comment = await new Comment(req.body);
  try {
    const savedComment = await comment.save();
    if (savedComment) {
      await Blog.updateMany(
        { _id: savedComment.blogPost },
        { $push: { comments: savedComment._id } }
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
  const id = req.params.id;

  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  try {
    const foundBlog = await Blog.findById(id);
    if (foundBlog) {
      return res.json(foundBlog);
    } else {
      return res.status(404).json({ msg: "blog not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getOneComment = async (req, res) => {
  const id = req.params.id;
  
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid comment id" });
  }
  try {
    const foundComment = await Comment.findById(id);
    if (foundComment) {
      return res.json(foundComment);
    } else {
      return res.status(404).json({ msg: "comment not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllBlogs = async (req, res) => {
  let { author, title, category, slug, tags, description } = req.query;
  const queryObj = {
    ...(title && { title: new RegExp(`${title}`) }),
    ...(description && { description: new RegExp(`${description}`) }),
    ...(category && { category}),
    ...(author && { author}),
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
  let { body, commenter,blogPost } = req.query;

  const queryObj = {
    ...(body && { body: new RegExp(`${body}`) }),
    ...(blogPost && { blogPost }),
    ...(commenter && { commenter }),
  };
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;

  try {
    const getComments = await Comment.find(queryObj)
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

exports.updateOneBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

    const loggedUser = await User.findById(req.user.id);
    if (updatedBlog.author._id == req.user.id || loggedUser.role === "admin") {
      return res.status(200).send(updatedBlog);
    } else {
      return res
        .status(404)
        .json({ msg: "you are not authorized to perform this operation" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    const loggedUser = await User.findById(req.user.id);
    
    if (
      updatedComment.commenter == req.user.id ||
      loggedUser.role === "admin"
    ) {
      return res.status(200).send(updatedComment);
    } else {
            return res
        .status(404)
        .json({ msg: "you are not authorized to perform this operation" });

    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.deleteOneBlog = async (req, res) => {
  const id = req.params.id;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  try {
    const deletedBlog = await Blog.findById(id);
    if (deletedBlog) {
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedBlog.author._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedBlog.remove().then(() => {
          return res.status(200).send(deletedBlog);
        });
        ;
      } else {
          return res
          .status(404)
          .json({ msg: "you are not authorized to perform this operation" })
      }
    } else {
      return res.status(404).json({ msg: "blog not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteOneComment = async (req, res) => {
  const id = req.params.id;
  if (validateId(id, res)) {
    return res.status(404).json({ msg: "invalid comment id" });
  }
  try {
    const deletedComment = await Comment.findById(id);
    if (deletedComment) {
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedComment.commenter == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedComment.remove().then(() => {
          return res.status(200).send(deletedComment);
        });
      } else {
        return res
          .status(404)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "comment not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
