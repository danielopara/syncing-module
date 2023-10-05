const http = require("http");
const app = require("./app");
const connect = require("./db/connectDB");
require("dotenv").config();

const port = process.env.PORT || 4000;
const server = http.createServer(app);

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log("Connected to", { port });
    });
  } catch (err) {
    console.log("error", err);
  }
};

start();
