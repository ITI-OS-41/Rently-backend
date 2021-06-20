const User = require("../models/User");

const authAdmin = async (req, res, next) => {
  try {
    console.log(req.user)
    const user = await User.findOne({ _id: req.user.id });
    console.log(user)
    if (user.role !== "admin")
      return res.status(500).json({ msg: "Admin resources access denied." });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authAdmin;
