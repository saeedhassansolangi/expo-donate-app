const User = require("../models/User");
const Item = require("../models/Item");
const moment = require("moment");

const addDonateItems = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User not found with this ${email}`);
    }

    try {
      const newDonation = await Item({ ...req.body });
      newDonation.donar = user._id;
      newDonation.item_collecing_time = moment().add(3, "hours").toDate();
      await newDonation.save();
      user.donation.unshift(newDonation);
      await user.save();
      return res.status(201).json({
        message: "donation added successfully",
      });
    } catch (error) {
      return res.json({ message: error.message });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const retriveUserDonations = (req, res) => {
  const { username: email } = req.params;
  User.findOne({ email })
    .populate("donation")
    .exec((err, user) => {
      try {
        if (err) throw new Error(err);
        if (!user) throw new Error("user not found");
        return res.send({ donations: user.donation });
      } catch (error) {
        return res.json({ message: error.message });
      }
    });
};

const retriveAllDonation = (req, res) => {
  const start = moment().subtract(24, "hours").toDate();
  Item.find({ created_at: { $gte: start } })
    .populate("donar volunteer")
    .exec((err, donations) => {
      try {
        if (err) throw new Error(err);
        return res.send(donations);
      } catch (error) {
        res.json({ message: error.message });
      }
    });
};

const distributeItem = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User not found with this ${email}`);
    }

    try {
      const donation = await Item.findById(id);
      if (!donation) {
        throw new Error("donation not found");
      }

      donation.status = "distributed";
      donation.distributed_time = Date.now();
      await donation.save();

      return res.status(201).json({
        message: "donation distributed successfully",
      });
    } catch (error) {
      return res.json({ message: error.message });
    }
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
};

const volunteerAdded = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User not found with this ${email}`);
    }

    try {
      const donation = await Item.findById(id);
      if (!donation) throw new Error("donation not found");

      donation.status = "collected";
      donation.volunteer = user._id;
      donation.collected_time = Date.now();
      donation.item_distributing_time = moment().add(24, "hours").toDate();
      await donation.save();

      return res.status(201).json({
        message: "item collected successfully successfully",
      });
    } catch (error) {
      return res.json({ message: error.message });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  addDonateItems,
  retriveAllDonation,
  retriveUserDonations,
  distributeItem,
  volunteerAdded,
};
