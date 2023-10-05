const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUniqueNumber,
} = require("../../controllers/user/user");

router.route("/").post(createUser);
router.route("/unique").get(getUniqueNumber);
router.route("/login").post(loginUser);

module.exports = router;
