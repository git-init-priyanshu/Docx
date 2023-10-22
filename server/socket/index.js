const socket = require("./socket");

module.exports = (io, app) => {
  app.use((req, res, next) => {
    req.socket.io = socket(io);
    next();
  });
};
