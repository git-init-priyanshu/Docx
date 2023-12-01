import { Express } from "express-serve-static-core";

import { socket } from "./socket";

export const socketIO = (io: any, app: Express) => {
  app.use((req: any, _res: any, next: () => void) => {
    req.socket.io = socket(io);
    next();
  });
};
