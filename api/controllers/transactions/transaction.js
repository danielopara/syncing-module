const Transactions = require("../../modules/transactions/Transaction");
const User = require("../../modules/user/User");

const checkForDuplicateTransaction = async (transactionData) => {
  try {
    const existingTransaction = await Transactions.findOne({
      transaction_reference: transactionData.transaction_reference,
    });

    if (existingTransaction) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking for duplicate transaction:", error);
    return error.message;
  }
};

const syncTransaction = async (req, res) => {
  const processRequestBody = async (body) => {
    const savedTransactions = [];
    const duplicatedTransactions = [];
    const userWmIds = [];
    const test_userWmIds = [];
    let user = new User();

    if (Array.isArray(body)) {
      for (const item of body) {
        const isDuplicate = await checkForDuplicateTransaction(item);
        if (isDuplicate) {
          console.log("Duplicate Transaction:", item);
          duplicatedTransactions.push(item);
          const wmId = item.user_wmId;
          test_userWmIds.push(wmId);
          console.log(test_userWmIds);
          continue;
        } else {
          const transactionData = new Transactions(item);

          try {
            const savedTransaction = await transactionData.save();
            console.log("Saved Transaction:", savedTransaction);
            savedTransactions.push(savedTransaction);

            const wmId = item.user_wmId;
            userWmIds.push(wmId);
          } catch (error) {
            console.error("Error saving Transaction:", error);
            res.status(500).json({ error: "Error", msg: error.message });
          }
        }
      }
      console.log(userWmIds);
      for (const wmId of userWmIds) {
        const user = await User.findOne({ wm_id: wmId });
        console.log(user);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const totalBalance = savedTransactions.reduce((total, transaction) => {
          const balanceChange = transaction.amount;
          return total + balanceChange;
        }, 0);
        user.offline_balance += totalBalance;
        await user.save();
      }

      res.status(201).json({
        success: "Success",
        saved: {
          msg: "saved transactions",
          transactions:
            savedTransactions.length > 0
              ? savedTransactions
              : "no transactions were saved",
        },
        duplicated: {
          msg: "duplicated transactions",
          transactions:
            duplicatedTransactions.length > 0
              ? duplicatedTransactions
              : "no duplicate transactions",
        },
        updatedOfflineBalance: user.offline_balance,
      });
    } else {
      const item = req.body;
      const isDuplicate = await checkForDuplicateTransaction(item);
      if (isDuplicate) {
        console.log("Duplicate transaction: " + item);
        duplicatedTransactions.push(item);
      } else {
        const syncData = new Transactions(item);
        try {
          const savedTransfer = await syncData.save();
          console.log("Saved Transaction:", savedTransfer);
          savedTransactions.push(savedTransfer);
        } catch (error) {
          console.error("Error saving Transaction:", error);
          res.status(500).json({ error: "Error", msg: error.message });
        }
      }

      //updating balance

      const wmId = req.body.wm_id;
      try {
        const user = await User.findOne({ wm_id: wmId });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const totalBalance = savedTransactions.reduce((total, transaction) => {
          const balanceChange = transaction.amount;
          return total + balanceChange;
        }, 0);
        user.offline_balance += totalBalance;
        await user.save();

        res.status(201).json({
          saved: {
            msg: "saved transactions",
            transactions:
              savedTransactions.length > 0
                ? savedTransactions
                : "no transactions were saved",
          },
          duplicated: {
            msg: "duplicated transactions",
            transactions:
              duplicatedTransactions.length > 0
                ? duplicatedTransactions
                : "no duplicate transactions",
          },
        });
      } catch (e) {
        console.error("Error updating offline balance:", error);
        res.status(500).json({ error: "Error", msg: error.message });
      }
    }
  };

  processRequestBody(req.body);
};

const createTransaction = async (req, res) => {
  const savedTransactions = [];

  const processRequestBody = (body) => {
    if (Array.isArray(body)) {
      body.forEach((item, index) => {
        const transactionData = new Transactions(item);
        transactionData
          .save()
          .then((doc) => {
            console.log(`Saved Element ${index}:`, doc);
            savedTransactions.push(doc);
            if (savedTransactions.length === body.length) {
              const response = {
                message: "Synced successfully",
                transactions: savedTransactions,
              };
              res.status(201).json(response);
            }
          })
          .catch((err) => {
            console.error(`Error saving Element ${index}:`, err);
            res.status(500).json({ msg: err.message });
          });
      });
    } else {
      const transactionData = new Transactions(body);
      transactionData
        .save()
        .then((doc) => {
          console.log("Saved Single Object:", doc);
          res.status(200).json({
            msg: "saved successfully",
            transaction: {
              amount: doc.amount,
              username: doc.username,
              user_wmId: doc.user_wm_id,
            },
          });
        })
        .catch((err) => {
          console.error("Error saving Single Object:", err);
          res.status(500).json({ msg: err.message });
        });
    }
  };

  processRequestBody(req.body);
};

const getAllTransactions = async (req, res) => {
  await Transaction.find()
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });
};

module.exports = { createTransaction, getAllTransactions, syncTransaction };
