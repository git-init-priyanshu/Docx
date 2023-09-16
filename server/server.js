const connectToMongoDB = require("./db");
connectToMongoDB();
const Doc = require("./models/doc");

const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
app.use(express.json());

const socketIO = require("socket.io")(http, {
  cors: {
    // origin: "http://localhost:80",
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on("get-doc", async (docId) => {
    socket.join(docId);

    const doc = await getDoc(docId);

    socket.emit("load-doc", doc.data);

    socket.on("save-doc", async (data) => {
      console.log("save doc");
      await Doc.findOneAndUpdate({ docId }, { data });
    });

    socket.on("text-change", (content) => {
      socket.broadcast.to(docId).emit("text-changed", content);
    });
  });
});

async function getDoc(docId) {
  if (docId === null) return;

  const doc = await Doc.findOne({ docId });

  if (doc) return doc;
  return null;
}

// Available Routes
app.use("/api/doc", require("./routes/docRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
