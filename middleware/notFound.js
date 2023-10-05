const notfound = (req, res, next) =>
  res.status(404).send("route does not exist");

module.exports = notfound;
