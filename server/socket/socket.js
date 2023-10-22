// const socketIO = require("./index");
const Doc = require("../models/doc");

function socket (socketIO){
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
}

async function getDoc(docId) {
  if (docId === null) return;

  const doc = await Doc.findOne({ docId });

  if (doc) return doc;
  return null;
}

module.exports = socket;