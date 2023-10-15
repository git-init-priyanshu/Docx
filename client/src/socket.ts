import { io } from "socket.io-client";

import { URL } from "./App";

const SOCKET_URL = `http://${URL}`;
export const socket = io(SOCKET_URL, { autoConnect: true});
