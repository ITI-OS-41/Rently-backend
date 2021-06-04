/** @format */

const router = require('express').Router();
const Blog = require('../models/Blog');
const passport = require('passport');

// Import controllers
const {
	create,
	upload,
	getAll,
	getOne,
	update,
	deleteOne,
	getBySlug,
	getByTag
} = require('../controllers/blog-controller');
// * create blog

router.post('/new', upload, create);
// * GET ONE
// router.get('/:id', getOne);

// * GET ALL
router.get('/', getAll);

// * UPDATE
router.post('/edit/:id', update);

// * DELETE
router.delete('/:id', deleteOne);

// * Find by slug name
// router.get('/:slug', getBySlug);

// * Find by  tag
router.get('/tags', getByTag);
router.get('/tags/:tag', getByTag);

module.exports = router;
