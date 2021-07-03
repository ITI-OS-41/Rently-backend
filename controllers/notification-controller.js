const Notification = require("../models/Notification");
const { NOTIFICATION, ID } = require("../helpers/errors");
const ObjectId = require("mongoose").Types.ObjectId;

const validateNotification = require("../validation/notification");

exports.getAll = async (req, res) => {
  let { receiver, conversation, type,isRead, content } = req.query;
  const queryObj = {
    ...(receiver && { receiver }),
    ...(type && { type }),
    ...(isRead && { isRead }),
    ...(conversation && { conversation }),
    ...(content && { content: new RegExp(`${content}`) }),
  };
  // * ...(email && { email: /regex here/ }),
const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;
  try {

  const getNotifications= await Notification.find(queryObj)
   .limit(limit)
      .skip(skip)
      .sort(sortQuery);
   if (getNotifications) {
      return res
        .status(200)
        .send({ res: getNotifications, pagination: { limit, skip, page } })
    } else {
      return res.status(404).json({ msg: "no notifications found" });
    }
  }catch(err) {
    return res.status(500).json(err);
  }
};

exports.getOne = (req, res) => {
  const id = req.params.id;

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
  
  const notification = new Notification(
  {...req.body}
  );
try{
  const savedNotification = await notification.save()
    if(savedNotification){

      return res.status(200).json({ notification });
    }
    }catch(err) {
      return res.status(500).send({ msg: err.message });
    };
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
