/** @format */

const Faq = require("../models/Faq");

exports.create = async (req, res) => {
  req.body.createdBy = req.user.id;
  const question = await new Faq(req.body).save();
  
  res.status(200).send(question);
};

exports.getOne = (req, res) => {
  Faq.findOne({ _id: req.params.id })
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
};

exports.getAll = async (req, res) => {
  let { _id, slug } = req.query;
  console.log(req.query);
  const queryObj = {
    ...(_id && { _id }),
    ...(slug && { slug }),
  };
  await Faq.find(queryObj).then((objects) => {
    res.status(200).send(objects);
  });
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
  Faq.findById(req.params.id)
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
};
