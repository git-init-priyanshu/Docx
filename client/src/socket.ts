import { io } from "socket.io-client";

const URL: string = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

const SOCKET_URL = `http://${URL}`;
export const socket = io(SOCKET_URL, { autoConnect: true});
