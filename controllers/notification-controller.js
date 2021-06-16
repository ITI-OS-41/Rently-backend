const Notification = require("../models/Notification");
const { NOTIFICATION, ID } = require("../helpers/errors");
const ObjectId = require("mongoose").Types.ObjectId;

const validateNotification = require("../validation/notification");

exports.getAll = async (req, res) => {
  let { _id, receiver, sender, content } = req.query;
  const queryObj = {
    ...(_id && { _id }),
    ...(receiver && { receiver }),
    ...(sender && { sender }),
    ...(content && { content: new RegExp(`${content}`) }),
  };
  // * ...(email && { email: /regex here/ }),

  await Notification.find(queryObj).then((objects) => {
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

  Notification.findById(id)
    .then((notification) => {
      if (notification) {
        return res.json(notification);
      } else {
        return res.status(404).json({ msg: NOTIFICATION.notFound });
      }
    })
    .catch((err) => {
      console.log({ err });
      return res.status(500).json({ msg: ID.invalid });
    });
};

exports.create = async (req, res) => {
  const { isValid, errors } = await validateNotification(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }

  const notification = new Notification({
    receiver: req.body.receiver,
    sender: req.body.sender,
    content: req.body.content,
  });

  await notification
    .save()
    .then((result) => {
      res.json({ notification });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }
  const { isValid, errors } = await validateNotification(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }

  await Notification.findOneAndUpdate({ _id: req.params.id }, req.body, {
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

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      id: ID.invalid,
    });
  }

  Notification.findById(req.params.id)
    .then((notification) => {
      if (notification) {
        notification.remove().then(() => {
          return res.status(200).send(notification);
        });
      } else {
        return res.status(404).json({ msg: NOTIFICATION.notFound });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: error.message });
    });
};
