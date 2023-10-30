import { Doc } from "../models/doc";

export const socket = (socketIO: any) => {
  console.log("here")
  socketIO.on("connection", (socket: any) => {
    console.log(`${socket.id} user just connected!`);

    socket.on("get-doc", async (docId: string) => {
      socket.join(docId);

      const doc = await getDoc(docId);

      socket.emit("load-doc", doc.data);

      socket.on("save-doc", async (data: any) => {
        console.log("save doc");
        await Doc.findOneAndUpdate({ docId }, { data });
      });

      socket.on("text-change", (content: any) => {
        socket.broadcast.to(docId).emit("text-changed", content);
      });
    });
  });
};

async function getDoc(docId: string) {
  if (docId === null) return;

  const doc = await Doc.findOne({ docId });

  if (doc) return doc;
  return null;
}
