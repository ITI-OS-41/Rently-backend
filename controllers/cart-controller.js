/** @format */
const { validateId } = require("../helpers/errors");
const Cart = require("../models/Cart");
const User = require("../models/User");

exports.createOneBlog = async (req, res) => {
  const { category, title, description, tags, headerPhoto, bodyPhotos } =
    req.body;
  const blog = await new Blog({
    author: req.user.id,
    category,
    title,
    description,
    tags,
    headerPhoto,
    bodyPhotos,
  });
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
    return res.status(500).json(err);
  }
};

exports.getOneBlog = async (req, res) => {
  const id = req.params.id;

  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid blog id" });
  }
  try {
    const foundBlog = await Blog.findById(id);
    if (foundBlog) {
      return res.status(200).json(foundBlog);
    } else {
      return res.status(404).json({ msg: "blog not found" });
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
    ...(category && { category }),
    ...(author && { author }),
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
    return res
      .status(200)
      .send({ res: getPosts, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneBlog = async (req, res) => {
  const { category, title, description, tags, headerPhoto, bodyPhotos } =
    req.body;
  try {
    const blog = await Blog.findById(req.params.id);

    const updatedBlog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        author: req.user.id,
        category,
        title,
        description,
        tags: req.body.tags || blog.tags,
        headerPhoto,
        bodyPhotos: req.body.bodyPhotos || blog.bodyPhotos,
      },
      {
        new: true,
      }
    );
    if (updatedBlog) {
      const loggedUser = await User.findById(req.user.id);
      if (
        updatedBlog.author._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        return res.status(200).send(updatedBlog);
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "blog not updated" });
    }
  } catch (error) {
    return res.status(500).json(err);
  }
};

exports.deleteOneBlog = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
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
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "blog not deleted" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
