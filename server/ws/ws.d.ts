// Minimal local types for `ws` v6, which ships none. Only the surface this
// server uses is declared; swap for @types/ws if the dependency is upgraded.
declare module "ws" {
  import type { IncomingMessage } from "node:http";
  import type { Duplex } from "node:stream";

  class WebSocket {
    static Server: typeof WebSocketServer;
  }

  class WebSocketServer {
    constructor(options: { noServer: boolean });
    on(event: "connection", cb: (conn: WebSocket, req: IncomingMessage) => void): void;
    emit(event: "connection", conn: WebSocket, req: IncomingMessage): void;
    handleUpgrade(
      req: IncomingMessage,
      socket: Duplex,
      head: Buffer,
      cb: (conn: WebSocket) => void,
    ): void;
  }

  export default WebSocket;
}
