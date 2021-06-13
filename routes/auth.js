/** @format */

const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { catchErrors } = require('../helpers/errors');

// const validateRegisterInput = require("../validation/register")
const validateLoginInput = require('../validation/login');

// Import controllers
const {
	register,
	login,
	forgetPassword,
	resetPassword,
	updatePassword,
	confirmPassword,
} = require('../controllers/auth-controller');

router.post('/register', register);
router.post('/login', login);

router.post('/forget', catchErrors(forgetPassword));
router.get('/reset/:token', catchErrors(resetPassword));
router.post('/reset/:token', confirmPassword, updatePassword);

module.exports = router;
