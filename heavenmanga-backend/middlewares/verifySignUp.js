// heavenmanga-backend/middlewares/verifySignUp.js
const User = require("../models/user.model");

checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const verifySignUp = {
  checkDuplicateEmail,
};

module.exports = verifySignUp;