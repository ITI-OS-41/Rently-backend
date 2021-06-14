/** @format */
const { validateId } = require('../helpers/errors');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const { BLOG_POST, SLUG } = require('../helpers/errors');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: "That filetype isn't allowed!" }, false);
		}
	},
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	// check if there is no new file to resize
	if (!req.file) {
		next(); // skip to the next middleware
		return;
	}
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	// now we resize
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	// once we have written the photo to our filesystem, keep going!
	next();
};

exports.create = async (req, res) => {
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
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit); 
  const skip = (page * limit) -limit;       

	let { _id, slug } = req.query;
	const queryObj = {
		...(_id && { _id }),
		...(slug && { slug }),
	};
	await Blog.find(queryObj)
  .skip(skip)
  .limit(limit)
  .then((objects) => {
		res.status(200).send(objects);
	});
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

exports.getBySlug = async (req, res, next) => {
	Blog.findOne({ slug: req.params.slug })
		.then((blogPost) => {
			if (blogPost) {
				return res.status(200).json(blogPost);
			} else {
				return res.status(404).json({ msg: SLUG.notFound });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ msg: SLUG.invalidSlug });
		});
};

exports.getByTag = async (req, res) => {
	const tag = req.params.tag;
	const tagQuery = tag || { $exists: true, $ne: [] };
	const tagsPromise = Blog.getTagList();
	const postsPromise = Blog.find({ tags: tagQuery });
	const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);
	console.log('tags ', tags);

	res.status(200).send([tags, posts]);
};
