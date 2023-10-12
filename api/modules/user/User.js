const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  wm_id: { type: String, required: true },
  offline_balance: { type: Number },
  local_balance: { type: Number, required: true },
});

module.exports = mongoose.model("User", userSchema);
