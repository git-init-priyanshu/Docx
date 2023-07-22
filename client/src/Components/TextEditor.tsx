import { useEffect, useState } from "react";
import Quill from "quill";

import "quill/dist/quill.snow.css";
import { socket } from "../socket";
import { TOOLBAR_OPTIONS } from "./ToolbarOptions";

export default function TextEditor() {
  // const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    new Quill("#container", {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    return () => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.innerHTML = "<div id='container'></div>";
      }

      socket.disconnect();
    };
  }, []);

  return <div id="container"></div>;
}
