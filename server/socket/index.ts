import { socket } from "./socket";

export const socketIO = (io, app) => {
  app.use((req, res, next) => {
    req.socket.io = socket(io);
    next();
  });
};
