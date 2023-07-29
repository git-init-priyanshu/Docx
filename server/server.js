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
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on("get-doc", async (docId) => {
    console.log("get-doc");
    const doc = await getDoc(docId);

    socket.join(docId);

    socket.emit("load-doc", doc.data);

    socket.on("change-text", (content) => {
      socket.broadcast.to(docId).emit("text-changed", content);
    });

    socket.on("save-doc", async (data) => {
      await Doc.findOneAndUpdate({ docId }, { data });
    });
    socket.on("create-doc", async (docId) => {
      console.log("create-doc");
      try {
        await createDoc(docId);
      } catch (error) {
        console.log(error);
      }
    });
  });
});

async function getDoc(docId) {
  if (docId === null) return;

  const doc = await Doc.findOne({ docId });

  if (doc) return doc;
  return null;
}

async function createDoc(docId) {
  if (docId === null) return;
  return await Doc.create({ docId: docId, data: {}, thumbnail: "" });
}

// Available Routes
app.get("/getAllDocs", async (req, res) => {
  const docs = await Doc.find();
  res.json({ data: docs });
});
app.post("/saveDocThumbnail", async (req, res) => {
  const { docId, thumbnail } = req.body;

  await Doc.findOneAndUpdate({ docId }, { thumbnail });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
