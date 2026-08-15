// Authenticated Yjs WebSocket server.
//
// Stock y-websocket has no auth hook, so the upgrade is intercepted here: the
// connection is only handed to setupWSConnection once the room token verifies
// and proves the caller is a member of the document this room belongs to.
//
// Run with: yarn ws  (node --env-file=.env server/ws/index.mts)

import { createServer } from "node:http";
import { createRequire } from "node:module";
// ws is pinned to v6 by y-websocket, which has no named WebSocketServer export.
import WebSocket from "ws";

import { roomForDoc } from "../../lib/room.ts";
import { verifyRoomToken } from "../../lib/roomToken.ts";

const require = createRequire(import.meta.url);
// Subpath without the extension — y-websocket's exports map only declares
// "./bin/utils", not "./bin/utils.cjs".
const { setupWSConnection } = require("y-websocket/bin/utils");

const PORT = Number(process.env.WS_PORT ?? 1234);
const SECRET = process.env.WS_TOKEN_SECRET;

if (!SECRET) {
  console.error("WS_TOKEN_SECRET is not set — refusing to start.");
  process.exit(1);
}

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (conn, req) => {
  const room = roomFromUrl(req.url);
  setupWSConnection(conn, req, { docName: room });
});

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const room = roomFromUrl(req.url);
  const payload = verifyRoomToken(url.searchParams.get("token"), SECRET);

  // The token names the document it was minted for, so a valid token for one
  // document cannot be replayed against another document's room.
  if (!payload || roomForDoc(payload.docId) !== room) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (conn) => {
    wss.emit("connection", conn, req);
  });
});

function roomFromUrl(rawUrl: string | undefined) {
  return decodeURIComponent((rawUrl ?? "").slice(1).split("?")[0]);
}

server.listen(PORT, () => {
  console.log(`Yjs WebSocket server listening on ws://localhost:${PORT}`);
});
