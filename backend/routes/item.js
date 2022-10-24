const express = require("express");
const {
  addDonateItems,
  retriveAllDonation,
  retriveUserDonations,
  distributeItem,
  volunteerAdded,
} = require("../controller/items");

const router = express.Router();

router.post("/", addDonateItems);
router.get("/", retriveAllDonation);
router.get("/:username", retriveUserDonations);
router.post("/:id/distribute", distributeItem);
router.post("/:id/collect", volunteerAdded);

module.exports = router;
