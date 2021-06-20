/** @format */
const { validateId } = require("../helpers/errors");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

const { BLOG_POST } = require("../helpers/errors");

exports.createBlog = async (req, res) => {
  req.body.author = req.user.id;
  const blogPost = await new Blog(req.body).save();
  res.status(200).send(blogPost);
};

exports.createComment = async (req, res) => {
  req.body.commenter = req.user.id;
  req.body.blogPost = req.params.blogId;
  const comment = await new Comment(req.body).save();
  res.status(200).send(comment);

  await Blog.updateMany(
    { _id: comment.blogPost },
    { $push: { comments: comment._id } }
  );
};

exports.getOneBlog = async (req, res) => {
  const id = req.params.id;
  validateId(id, res);
  await Blog.findById(id)
    .then((blogPost) => {
      if (blogPost) {
        return res.json(blogPost);
      } else {
        return res.status(404).json({ msg: "post not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: "post invalid id"});
    });
};

exports.getAllBlogs = async (req, res) => {
  let { _id, title,category, slug, tags } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(title && { title: new RegExp(`${title}`) }),
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
  const getPosts = await Blog.find(queryObj)
    .limit(limit)
    .skip(skip)
    .sort(sortQuery);

  res.status(200).send({ getPosts, pagination: { limit, skip, page } });
};

exports.getAllComments = async (req, res) => {
  let { body, commenter } = req.query;
  const postId = req.params.blogId;

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
  const getBlog = await Blog.find({ _id: postId });
  if (getBlog) {
    const getComments = await Comment.find({ blogPost: postId })
      .find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);

    res.status(200).send({ getComments, pagination: { limit, skip, page } });
  }
};

exports.updateBlog = async (req, res) => {
  await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: error.message });
    });
};

exports.updateComment = async (req, res) => {
  const foundBlog = await Blog.find({ _id: req.params.blogId });
  if (foundBlog) {
    await Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body, {
      new: true,
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ msg: error.message });
      });
  }
};

exports.deleteOneBlog = async (req, res) => {
  const id = req.params.id;
  validateId(id, res);

  Blog.findById(req.params.id)
    .then((blogPost) => {
      if (blogPost) {
        blogPost.remove().then(() => {
          return res.status(200).send(blogPost);
        });
      } else {
        return res.status(404).json({ msg: BLOG_POST.notFound });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: BLOG_POST.invalidId });
    });
};

exports.deleteOneComment = async (req, res) => {
  const id = req.params.commentId;
  const postId = req.params.blogId;
  validateId(postId, res);
  validateId(id, res);

  Comment.findById(id)
    .then((comment) => {
      if (comment) {
        comment.remove().then(() => {
          return res.status(200).send(comment);
        });
      } else {
        return res.status(404).json({ msg: "comment not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: "invalid comment id" });
    });
};

// exports.getBySlug = async (req, res, next) => {
//   Blog.findOne({ slug: req.params.slug })
//     .then((blogPost) => {
//       if (blogPost) {
//         return res.status(200).json(blogPost);
//       } else {
//         return res.status(404).json({ msg: SLUG.notFound });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json({ msg: SLUG.invalidSlug });
//     });
// };

// exports.getByTag = async (req, res) => {
// 	const tag = req.params.tag;
// 	const tagQuery = tag || { $exists: true, $ne: [] };
// 	const tagsPromise = Blog.getTagList();
// 	const postsPromise = Blog.find({ tags: tagQuery });
// 	const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);
// 	console.log('tags ', tags);
// 	res.status(200).send([tags, posts]);
// };

exports.getAllCategories= async(req,res)=> {

	const categoriesPromise = await Blog.getCategoryList();
  res.status(200).send(categoriesPromise)

}