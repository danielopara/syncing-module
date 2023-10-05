const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  syncTransaction,
} = require("../../controllers/transactions/transaction");

router.route("/").get(getAllTransactions).post(createTransaction);
router.route("/sync").post(syncTransaction);

module.exports = router;
