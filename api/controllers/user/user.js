const User = require("../../modules/user/User");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcrypt");

require("dotenv").config();
// const getUser = async (req, res) => {
//   await User.find()
//     .then((result) => {
//       const message = result.map((doc) => ({
//         username: doc.username,
//         password: doc.password,
//       }));
//       res.status(200).json(message);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// };

const getUniqueNumber = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ msg: "Invalid Bearer" });
  } else {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);
      const luckyNumber = Math.floor(Math.random() * 1000);
      res.status(200).json({
        msg: `hey ${decoded.username}, here is your unique number ${luckyNumber}`,
      });
    } catch (error) {
      res.status(401).json({ msg: "Not authorized" });
    }
  }
};

const createUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const wm_id = req.body.wm_id;
  const offline_balance = req.body.offline_balance;

  const hashedPassword = await bcyrpt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
    wm_id,
    offline_balance,
  });

  user
    .save()
    .then((doc) => {
      console.log(doc);
      const response = {
        message: "user created",
        user: {
          username: doc.username,
          password: hashedPassword,
        },
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: err.message,
      });
    });
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(500).json({ error: "no username or password" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(500).json({ error: "no user" });
    }
    const passwordMatch = await bcyrpt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    console.log(user.username, user.wm_id);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        wm_id: user.wm_id,
        offline_balance: user.offline_balance,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    res.status(200).json({
      success: "Login successful",
      token,
      username: decoded.username,
      wm_id: decoded.wm_id,
      offline_balance: decoded.offline_balance,
      id: decoded.id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Internal server error" });
  }

  //   User.find({ username: username, password: password })
  //     .then(() => {
  //       else {
  //         const id = new Date().getDate();
  //         const token = jwt.sign({ id, username }, process.env.JWT_SECRET_KEY, {
  //           expiresIn: "30d",
  //         });
  //         console.log(username, password);
  //         res.status(201).json({ msg: "user created", token: token });
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e.message);
  //       res.status(500).json({ msg: "error" });
  //     });
};

module.exports = { createUser, loginUser, getUniqueNumber };
