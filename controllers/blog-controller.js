/** @format */
const { validateId } = require('../helpers/errors');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const validator = require('validator');

const { BLOG_POST, SLUG } = require('../helpers/errors');

exports.create = async (req, res) => {
	req.body.author = req.user.id;
	const blogPost = await new Blog(req.body).save();
	res.status(200).send(blogPost);
};

exports.getOne = async (req, res) => {
	const id = req.params.id;
	validateId(id, res);
	await Blog.findById(id)
		.then((blogPost) => {
			if (blogPost) {
				return res.json(blogPost);
			} else {
				return res.status(404).json({ msg: BLOG_POST.notFound });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ msg: POST.invalidId });
		});
};

exports.getAll = async (req, res) => {
  let { _id, title, slug, tags } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(title && { title: new RegExp(`${title}`) }),
    ...(slug && { slug }),
    ...(tags && { tags: new RegExp(tags.replace(/,/g, "|")) }),
  };
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = page * limit - limit;
  const getPosts = await Blog.find(queryObj)
    .limit(limit)
    .skip(skip)
    .sort(sortQuery);

  res.status(200).send({ getPosts });
};

exports.update = async (req, res) => {
	await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	})
		.then((response) => {
			res.status(200).send(response);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send({ msg: error.message });
		});
};

exports.deleteOne = async (req, res) => {
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

exports.getByTag = async (req, res) => {
	const tag = req.params.tag;
	const tagQuery = tag || { $exists: true, $ne: [] };
	const tagsPromise = Blog.getTagList();
	const postsPromise = Blog.find({ tags: tagQuery });
	const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);
	console.log('tags ', tags);
	res.status(200).send([tags, posts]);
};
