const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["not_collected", "collected", "distributed"],
    required: true,
    default: "not_collected",
  },
  quantity: {
    type: Number,
    required: true,
  },
  quality: {
    type: String,
    enum: ["new", "gently used", "older but excellent"],
    required: true,
    default: "New",
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  donar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  distriuted_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  collected_time: {
    type: Number,
  },
  distributed_time: {
    type: Number,
  },
  item_collecing_time: {
    type: Number,
  },
  item_distributing_time: {
    type: Number,
  },
  created_at: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("Item", itemSchema);
