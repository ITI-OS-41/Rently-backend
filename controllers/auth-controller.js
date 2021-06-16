// /** @format */

// const router = require("express").Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");


// const { EMAIL, USERNAME, PASSWORD } = require("../helpers/errors");

// const validateRegisterInput = require("../validation/register");
// const validateLoginInput = require("../validation/login");

// exports.register = async (req, res) => {
//   const { isValid, errors } = await validateRegisterInput(req.body);

//   if (!isValid) {
//     return res.status(404).json(errors);
//   }

//   User.findOne({ email: req.body.email }).then((user) => {
//     if (user) {
//       errors.email = EMAIL.duplicate;
//       return res.status(404).json(errors);
//     }

//     bcrypt.genSalt(10, function (err, salt) {
//       bcrypt.hash(req.body.password, salt, function (err, hash) {
//         const newUser = new User({
//           ...req.body,
//           password: hash,
//         });

//         newUser
//           .save()
//           .then((newUser) => res.json(newUser))
//           .catch((err) => console.log(err));

//       });
//     });
//   });
// };

// exports.login = (req, res) => {
//   const { isValid, errors } = validateLoginInput(req.body);

//   if (!isValid) {
//     return res.status(404).json(errors);
//   }

//   User.findOne({ email: req.body.email }).then((user) => {
//     if (user) {
//       bcrypt.compare(req.body.password, user.password).then((isMatch) => {
//         if (isMatch) {
//           const token = jwt.sign(
//             {
//               id: user._id,
//               role: user.role || "user",
//             },
//             process.env.SECRET,
//             { expiresIn: "1d" },
//             function (err, token) {
//               return res.json({
//                 success: true,
//                 token: token,
//                 user: {
//                   _id: user._id,
//                   email: user.email,
//                   username: user.username,
//                   role: user.role || "user",
//                 },
//               });
//             }
//           );
//         } else {
//           errors.password = "Password is incorrect";
//           return res.status(404).json(errors);
//         }
//       });
//     } else {
//       errors.email = "user not found";
//       return res.status(404).json(errors);
//     }
//   });
// };

// exports.forgetPassword = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   // console.log(user);
//   if (!user) {
//     res.status(404).send({ msg: "mail has been sent" });
//     return;
//   }
//   user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
//   user.resetPasswordExpires = Date.now() + 3600000;
//   await user.save();
//   const resetURL = `http://${req.headers.host}/api/auth/reset/${user.resetPasswordToken}`;
//   console.log(resetURL);
//   // await mail.send({
//   // 	user,
//   // 	subject: 'Password Reset',
//   // 	text:'reset password',
//   // 	resetURL,
//   // 	filename:'mail'
//   // });
//   res.status(303).send({ msg: "redirect to change password" });
// };

// exports.resetPassword = async (req, res) => {
//   const user = await User.findOne({
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });
//   if (!user) {
//     res.status(404).send({ msg: "token has expired" });
//     return;
//   }
//   res.status(303).send({ msg: "redirect to reset password" });
// };

// exports.confirmPassword = (req, res, next) => {
//   if (req.body.password === req.body.confirmPassword) {
//     return next();
//   }
//   res.status("303").send({ msg: "redirect to reset again" });
// };

// exports.updatePassword = async (req, res, next) => {
//   const user = await User.findOne({
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });
//   if (!user) {
//     res.status(404).send({ msg: "token has expired" });
//     return;
//   }
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   await user.save();
//   res.status(303).send({ msg: "redirect to home page" });
// };
