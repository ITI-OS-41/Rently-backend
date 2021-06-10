/** @format */

const router = require('express').Router();
const Blog = require('../models/Blog');
const passport = require('passport');
const { catchErrors } = require('../helpers/errors');

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

router.post('/', upload, create);
// * GET ONE
// router.get('/:id', getOne);

// * GET ALL
router.get('/', catchErrors(getAll));

// * UPDATE
router.post('/:id', update);

// * DELETE
router.delete('/:id', deleteOne);

// * Find by slug name
router.get('/:slug', getBySlug);

// * Find by  tag
// router.get('/tags', getByTag);
// router.get('/tags/:tag', getByTag);

module.exports = router;
