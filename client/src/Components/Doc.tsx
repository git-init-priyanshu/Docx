import { useEffect, useState } from "react";
import Quill from "quill";
import { DeltaOperation, Sources, Quill as typesQuill } from "quill/index";
import { useParams } from "react-router-dom";

import "quill/dist/quill.snow.css";
import { socket } from "../socket";
import { TOOLBAR_OPTIONS } from "./utils/ToolbarOptions";

const SAVE_INTERVAL_MS = 2000;

export default function TextEditor() {
  const { id: docId } = useParams();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [quill, setQuill] = useState<any>(null);

  const toggleConnected: () => void = () => {
    setIsConnected((isConnected) => !isConnected);
  };

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-doc", (doc) => {
      quill.setContents(doc);
      quill.enable();
    });

    socket.emit("get-doc", docId);
  }, [socket, quill, docId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-doc", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, docId]);

  useEffect(() => {
    socket.connect();
    toggleConnected();

    const quill: typesQuill = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    quill.disable();
    quill.setText("Loading...");

    setQuill(quill);

    return () => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.innerHTML = "<div id='container'></div>";
      }

      socket.disconnect();
      toggleConnected();
    };
  }, []);

  if (quill) {
    quill.on(
      "text-change",
      function (
        delta: DeltaOperation,
        oldDelta: DeltaOperation,
        source: Sources
      ) {
        if (source == "api") {
          console.log("An API call triggered this change.");
        } else if (source == "user") {
          const content: DeltaOperation = quill.getContents();

          isConnected && socket.emit("change-text", content);
        }
      }
    );
    socket.on("text-changed", (content: DeltaOperation) => {
      quill.setContents(content);
    });
  }

  return <div id="container"></div>;
}
