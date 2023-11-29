import { io } from "socket.io-client";

const URL: string = import.meta.env.DEV
  ? import.meta.env.VITE_API_DEV_URL
  : import.meta.env.VITE_API_PROD_URL;

// const SOCKET_URL = `${URL}`;
const SOCKET_URL = "http://localhost:8000"

export const socket = io(SOCKET_URL, { autoConnect: true ,path: "/socket"});
