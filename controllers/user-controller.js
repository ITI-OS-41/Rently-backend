const User = require("../models/User");
const { USER } = require("../helpers/errors");
const ObjectId = require("mongoose").Types.ObjectId;

const validateRegisterInput = require("../validation/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAll = async (req, res) => {
  let { _id, username, email } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(username && { username }),
    ...(email && { email }),
  };

  // * ...(email && { email: /regex here/ }),

  await User.find(queryObj).then((objects) => {
    res.status(200).set("X-Total-Count", objects.length).json(objects);
  });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  User.findById(id).select({password:0})
    .then((user) => {
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).json({ msg: USER.notFound });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: USER.invalidId });
    });
};

exports.create = async (req, res) => {
  // const { isValid, errors } = await validateRegisterInput(req.body)

  // if (!isValid) {
  //   return res.status(404).json(errors)
  // }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = EMAIL.duplicate;
      return res.status(404).json(errors);
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        const newUser = new User({
          ...req.body,
          password: hash,
        });

        return newUser
          .save()
          .then((newUser) => res.json(newUser))
          .catch((err) => console.log(err));
      });
    });
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  // ADD USER VALIDATION

  const { isValid, errors } = await validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }

  await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .select({ password: 0 })
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

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  User.findById(id)
    .then((userPost) => {
      if (userPost) {
        userPost.remove().then(() => {
          return res.status(200).send(userPost);
        });
      } else {
        return res.status(404).json({ msg: USER.notFound });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: USER.invalidId });
    });
};
