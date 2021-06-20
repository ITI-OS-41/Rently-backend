/** @format */
const { validateId } = require("../helpers/errors");
const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");

exports.create = async (req, res) => {
	req.body.author = req.user.id;
	const blogPost = await new Blog(req.body).save();
	res.status(200).send(blogPost);
};

exports.getOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		await Blog.findById(id).then((blogPost) => {
			if (blogPost) {
				return res.json(blogPost);
			} else {
				return res.status(404).json({ msg: "post not found" });
			}
		});
	}
};

exports.getAll = async (req, res) => {
	const sortBy = req.query.sortBy || "createdAt";
	const orderBy = req.query.orderBy || "asc";
	const sortQuery = {
		[sortBy]: orderBy,
	};

	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const skip = page * limit - limit;
	let {title, slug, tags } = req.query;

	const queryObj = {
		...(title && { title: new RegExp(`${title}`) }),
		...(slug && { slug }),
		...(tags && { tags: new RegExp(tags.replace(/,/g, "|")) }),
	};

	const getPosts = await Blog.find(queryObj)
		.limit(limit)
		.skip(skip)
		.sort(sortQuery);
	res.status(200).send({ getPosts });
};

exports.update = async (req, res) => {
	req.body.author = req.user.id
	await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	})
	.then((response) => {
		res.status(200).send(response);
	});

};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	if (!validateId(id, res)) {
		Blog.findById(req.params.id).then((blogPost) => {
			if (blogPost) {
				blogPost.remove().then(() => {
					return res.status(200).send(blogPost);
				});
			} else {
				return res.status(404).json({ msg: "post not found" });
			}
		});
	}
};
