const connectToMongoDB = require("./db");
connectToMongoDB();
const Document = require("./models/doc");

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

  socket.on("get-doc", async (docId) => {
    const doc = await getDoc(docId);

    socket.join(docId);

    socket.emit("load-doc", doc.data);

    socket.on("change-text", (content) => {
      socket.broadcast.to(docId).emit("text-changed", content);
    });

    socket.on("save-doc", async (data) => {
      await Document.findOneAndUpdate({ docId }, { data });
    });

    socket.on("create-doc", async (docId) => {
      const doc = await createDoc(docId);

      socket.join(docId);

      socket.emit("laod-doc", doc.data);
    });
  });
});

async function getDoc(docId) {
  if (docId === null) return;

  const doc = await Document.findOne({ docId });

  if (doc) return doc;
  // return await Document.create({ docId: docId, data: "" });
}
async function createDoc(docId) {
  if (docId === null) return;

  const doc = await Document.findOne({ docId });

  if (doc) return;
  return await Document.create({ docId: docId, data: "" });
}

app.get("/getAllDocs", async (req, res) => {
  const docs = await Document.find();
  res.json({ data: docs });
});
app.post("/saveDocThumbnail", async (req, res) => {
  const { docId, thumbnail } = req.body;

  const doc = await Document.findOneAndUpdate({ docId }, { thumbnail });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
