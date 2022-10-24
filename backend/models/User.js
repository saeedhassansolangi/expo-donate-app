const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  username: {
    type: String,
    required: true,
    minlength: 5,
  },

  phone_number: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["volunteer", "donar"],
    default: "volunteer",
    required: true,
  },

  donation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(candidatePassword, user.password, (err, isMatched) => {
      if (err) reject(err);
      if (!isMatched) reject({ message: "Password is not matched" });
      resolve({ message: "Password is matched" });
    });
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
