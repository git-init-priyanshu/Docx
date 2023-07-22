const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);
  socket.on("change-text", (content) => {
    socket.broadcast.emit("text-changed", content);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
