const mongoose = require("mongoose");

const currentTime = Date.now();
const isoTime = new Date(currentTime).toISOString();

const transactionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  user_wmId: { type: String, required: true },
  balance_before_transfer: { type: String, required: true },
  amount: { type: Number, required: true },
  balance_after_transfer: { type: Number, required: true },
  transaction_reference: { type: String, required: true },
  receiver_name: { type: String, required: true },
  receiver_wmId: { type: String, required: true },
  description: { type: String, required: false },
  type: { type: String, required: true },
  sync_id: { type: String, required: true },
  sync_time: { type: String, default: isoTime },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Transactions", transactionSchema);
