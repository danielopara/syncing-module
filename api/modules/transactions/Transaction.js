const mongoose = require("mongoose");

const currentTime = Date.now();
const isoTime = new Date(currentTime).toISOString();
const uid = () => {
  let time = Date.now().toString(36).toLocaleUpperCase();
  let randoms = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  randoms = randoms
    .toString(36)
    .slice(0, 12)
    .padStart(12, "0")
    .toLocaleUpperCase();
  return "".concat(time, "-", randoms);
};

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
  sync_id: { type: String, default: uid() },
  sync_time: { type: String, default: isoTime },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Transactions", transactionSchema);
