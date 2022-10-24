const User = require("../models/User");
const jwt = require("jsonwebtoken");

const UserLogin = async (req, res) => {
  const { email: data, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: data }, { username: data }],
    });

    if (!user) throw new Error("User not found with this email or username");

    await user.comparePassword(password);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY"
    );

    const { _id, username, role, phone_number, email } = user;

    res.send({
      token,
      user: { _id, username, phone_number, email, role },
    });
  } catch (error) {
    return res.status(422).send({
      message: error.message,
    });
  }
};

const UserRegister = async function (req, res) {
  let { email, password, username } = req.body;
  password = password.trim();
  email = email.trim();
  username = username.trim();

  try {
    if (!email || !password || !username) {
      throw new Error("all fields are required");
    }

    const oldUserWithEmail = await User.find({ email });

    if (oldUserWithEmail && oldUserWithEmail.length > 0) {
      throw new Error("User already registered with this email");
    }

    const oldUserWithUsername = await User.find({ username });

    if (oldUserWithUsername && oldUserWithUsername.length > 0) {
      throw new Error("User already registered with this Username");
    }

    const user = new User({ ...req.body });

    await user.save();
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY"
    );

    return res.send({ token });
  } catch (error) {
    return res.status(422).send({
      message: error.message,
    });
  }
};

module.exports = {
  UserLogin,
  UserRegister,
};
