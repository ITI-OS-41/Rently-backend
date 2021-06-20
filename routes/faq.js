/** @format */

const router = require('express').Router();
const FAQ = require('../models/FAQ');
const validateFAQ = require('../validation/faq');
const { catchErrors } = require('../helpers/errors');
// Import controllers
const {
	create,
	getAll,
	getOne,
	update,
	deleteOne,
} = require('../controllers/faq-controller');
// * create blog

router.post('/', validateFAQ, catchErrors(create));
// * GET ONE
router.get('/:id', catchErrors(getOne));

// * GET ALL
router.get('/', catchErrors(getAll));

// * UPDATE
router.post('/:id', validateFAQ, catchErrors(update));

// * DELETE
router.delete('/:id', catchErrors(deleteOne));

module.exports = router;
