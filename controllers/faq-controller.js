/** @format */
const { validateId } = require("../helpers/errors");
const Faq = require("../models/Faq");

exports.create = async (req, res) => {
  req.body.createdBy = req.user.id;
  const question = await new Faq(req.body).save();

  res.status(200).send(question);
};

exports.getOne = async (req, res) => {
  const id = req.params.id;
  if (!validateId(id, res)) {
    await Faq.findOne({ _id: req.params.id })
      .then((question) => {
        if (question) {
          return res.json(question);
        } else {
          return res.status(404).json({ msg: "question notFound" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: "question invalidId" });
      });
  }
};

exports.getAll = async (req, res) => {
  let { _id, slug, title } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = page * limit - limit;

  const queryObj = {
    ...(_id && { _id }),
    ...(title && { title: new RegExp(`${title}`) }),
    ...(slug && { slug }),
  };
  const getFaqs = await Faq.find(queryObj)
    .limit(limit)
    .skip(skip)
    .sort(sortQuery);
  res.status(200).send(getFaqs);
};

exports.update = async (req, res) => {
  req.body.createdBy = req.user.id;
  await Faq.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ msg: "question invalidId" });
    });
};

exports.deleteOne = async (req, res) => {
  const id = req.params.id;
  if (!validateId(id, res)) {
    Faq.findById(id)
      .then((question) => {
        if (question) {
          question.remove().then(() => {
            return res.status(200).send(question);
          });
        } else {
          return res.status(404).json({ msg: "question not found" });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ msg: "question invalidId" });
      });
  }
};
