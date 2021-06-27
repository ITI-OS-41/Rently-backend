const Rent = require("../models/Rent");
const User = require("../models/User");
const { validateId } = require("../helpers/errors");

exports.createOneRent = async (req, res) => {
  req.body.renter = req.user.id;
  const rent = await new Rent(req.body);
      const savedRent = await rent.save();
    if (savedRent) {
      return res.status(200).json(savedRent);
    } else {
      return res.status(404).json({ msg: "rent not saved" });
    }
  
};

exports.getOneRent = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid rent id" });
  }
  try {
    const foundRent = await Rent.findById(id);
    if (foundRent) {
      console.log({ foundRent });
      const loggedUser = await User.findById(req.user.id);
      if (
        foundRent.renter._id == req.user.id ||
        foundRent.owner._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        return res.status(200).json(foundRent);
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "rent not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  } 
};
exports.getAllRents = async (req, res) => {
  let { owner, renter, status, insurance, totalPrice, item, from, to } =
    req.query;
  const queryObj = {
    ...(owner && { owner }),
    ...(renter && { renter }),
    ...(item && { item }),
    ...(status && { status }),
    ...(insurance && { insurance }),
    ...(totalPrice && { totalPrice }),
    ...(from && { from }),
    ...(to && { to }),
  };
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "asc";
  const sortQuery = {
    [sortBy]: orderBy,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = page * limit - limit;

  try {
    const getRents = await Rent.find(queryObj)
      // res.status(200).set("X-Total-Count", objects.length).json(objects);
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    //Handle Rent with authorization
    if (getRents) {
      // const loggedUser = await User.findById(req.user.id);
      // if (foundRent.renter._id == req.user.id || loggedUser.role === "admin") {
      return res
        .status(200)
        .send({ res: getRents, pagination: { limit, skip, page } });
      // } else {
      //   return res
      //     .status(403)
      //     .json({ msg: "you are not authorized to perform this operation" });
      // }
    } else {
      return res.status(404).json({ msg: "no rents found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneRent = async (req, res) => {
  try {
    const updatedRent = await Rent.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (updatedRent) {
      console.log(updatedRent);
      const loggedUser = await User.findById(req.user.id);
      if (
        updatedRent.renter._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        return res.status(200).send(updatedRent);
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "rent not updated" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.deleteOneRent = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid rent id" });
  }
  try {
    const deletedRent = await Rent.findById(id);
    if (deletedRent) {
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedRent.renter._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedRent.remove().then(() => {
          return res.status(200).send(deletedRent);
        });
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "rent not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
