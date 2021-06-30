/** @format */
const { validateId } = require("../helpers/errors");
const Cart = require("../models/Cart");
const User = require("../models/User");

exports.createOneCart = async (req, res) => {
   req.body.renter = req.user.id
  const cart = await new Cart(...req.body);
  try {
    const savedCart = await cart.save();
    if (savedCart) {
      return res.status(200).json(savedCart);
    } else {
      return res.status(404).json({ msg: "cart not saved" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getOneCart = async (req, res) => {
  const id = req.params.id;

  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid Cart id" });
  }
  try {
    const foundCart = await Cart.findById(id);
    if (foundCart) {
      return res.status(200).json(foundCart);
    } else {
      return res.status(404).json({ msg: "Cart not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllCarts = async (req, res) => {
  let { rent, orderTotal, renter,} = req.query;
  const queryObj = {
    ...(orderTotal && { orderTotal }),
    ...(renter && { renter }),
    ...(rent && { rent }),
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
    const getCarts = await Cart.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);
    return res
      .status(200)
      .send({ res: getCarts, pagination: { limit, skip, page } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateOneCart = async (req, res) => {
   const id = req.params.id;

  try {
    const Cart = await Cart.findById(id);

    const updatedCart = await Cart.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        ...req.body
      },
      {
        new: true,
      }
    );
    if (updatedCart) {
      console.log(updatedCart)
      
      const loggedUser = await User.findById(req.user.id);
      if (
        updatedCart.renter._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        return res.status(200).send(updatedCart);
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "Cart not updated" });
    }
  } catch (error) {
    return res.status(500).json(err);
  }
};

exports.deleteOneCart = async (req, res) => {
  const id = req.params.id;
  if (validateId(id)) {
    return res.status(404).json({ msg: "invalid Cart id" });
  }
  try {
    const deletedCart = await Cart.findById(id);
    if (deletedCart) {
      console.log(deletedCart)
      const loggedUser = await User.findById(req.user.id);
      if (
        deletedCart.renter._id == req.user.id ||
        loggedUser.role === "admin"
      ) {
        deletedCart.remove().then(() => {
          return res.status(200).send(deletedCart);
        });
      } else {
        return res
          .status(403)
          .json({ msg: "you are not authorized to perform this operation" });
      }
    } else {
      return res.status(404).json({ msg: "Cart not deleted" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
