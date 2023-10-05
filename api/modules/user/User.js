const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  wm_id: { type: String, required: true },
  offline_balance: { type: Number },
});

module.exports = mongoose.model("User", userSchema);
