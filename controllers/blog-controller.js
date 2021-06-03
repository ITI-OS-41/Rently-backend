/** @format */

const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { BLOG, SLUG } = require('../helpers/errors');

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
	const blog = await new Blog(req.body).save();
	console.log(blog);
	res.status(200).send(blog);
};

exports.getOne = (req, res) => {
	const Id = req.params.id;

	Blog.findById(Id)
		.then((blog) => {
			if (blog) {
				return res.json(blog);
			} else {
				return res.status(404).json({ msg: BLOG.notFound });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ msg: BLOG.invalidId });
		});
};

exports.getAll = async (req, res) => {
	// let { _id, slug } = req.query;
	// console.log(req.query);
	// queryObj = {
	// 	...(_id && { _id }),
	// 	...(slug && { slug }),
	// };
	await Blog.find().then((objects) => {
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
	Blog.findById(req.params.id)
		.then((blog) => {
			if (blog) {
				blog.remove().then(() => {
					return res.status(200).send(blog);
				});
			} else {
				return res.status(404).json({ msg: 'post not found!' });
			}
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send({ msg: 'post' });
		});
};


exports.getBySlug = async (req, res, next) => {

    // const slug = req.params.slug;
    // console.log("slug ",slug);
	Blog.findOne({slug:req.params.slug})
		.then((blog) => {
			if (blog) {
				return res.status(200).json(blog);
			} else {
				return res.status(404).json({ msg: SLUG.notFound });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ msg: SLUG.invalidSlug });
		});
};
