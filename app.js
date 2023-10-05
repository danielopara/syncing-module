const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//import routes ⬇⬇⬇
const userRoutes = require("./api/routes/user/user");
const transactionRoutes = require("./api/routes/transactions/transaction");
const cors = require("cors");

app.use(cors({ origin: "*" }));

// middleware for wrong routes
const notFound = require("./middleware/notFound");

app.use(express.json());

// put routes ⬇⬇⬇
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/transaction", transactionRoutes);

// wrong routes
app.use(notFound);
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// error handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
