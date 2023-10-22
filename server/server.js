const connectToMongoDB = require("./db");
connectToMongoDB();
// const Doc = require("./models/doc");

const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
app.use(express.json());

require("dotenv").config();

const socketIO = require("socket.io")(http, {
  cors: {
    origin: [
      process.env.VERCEL_URL,
      "http://localhost:80",
      "http://localhost:4173",
      "http://localhost:5173",
    ],
  },
});
require("./socket/index")(socketIO, app);

// Available Routes
app.use("/api/doc", require("./routes/docRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = http;
