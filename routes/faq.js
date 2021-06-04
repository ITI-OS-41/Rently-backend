/** @format */

const router = require('express').Router();
const FAQ = require('../models/FAQ');

// Import controllers
const {
	create,
	getAll,
	getOne,
	update,
	deleteOne,
} = require('../controllers/faq-controller');
// * create blog

router.post('/new', create);
// * GET ONE
router.get('/:id', getOne);

// * GET ALL
router.get('/', getAll);

// * UPDATE
router.post('/edit/:id', update);

// * DELETE
router.delete('/:id', deleteOne);

module.exports = router;
