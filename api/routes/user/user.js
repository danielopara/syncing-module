const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUniqueNumber,
  deductFromLocalBalance,
} = require("../../controllers/user/user");

router.route("/").post(createUser);
router.route("/unique").get(getUniqueNumber);
router.route("/login").post(loginUser);
router.route("/:id").post(deductFromLocalBalance);

module.exports = router;
