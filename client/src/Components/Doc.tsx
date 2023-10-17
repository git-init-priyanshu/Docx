import { useEffect, useState } from "react";
import Quill from "quill";
import { DeltaOperation, Sources, Quill as typesQuill } from "quill/index";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import axios from "axios";
import _ from "lodash";

import "quill/dist/quill.snow.css";
import { socket } from "../socket";
import { TOOLBAR_OPTIONS } from "./utils/ToolbarOptions";
import { URL } from "../App";

export default function Doc() {
  const { id: docId } = useParams();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [quill, setQuill] = useState<any>(null);

  const toggleConnected: () => void = () => {
    setIsConnected((isConnected) => !isConnected);
  };

  const getDocThumbnail: () => void = async () => {
    const page = document.getElementById("container");
    const canvas = await html2canvas(page!, { scale: 0.5 });

    const thumbnail = canvas.toDataURL(`${docId}thumbnail/png`);

    await axios.post(`${URL}/api/doc/saveDocThumbnail`, {
      docId,
      thumbnail,
    });
  };

  // // Load Doc
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.emit("get-doc", docId);

    socket.once("load-doc", (doc) => {
      quill.setContents(doc);
      quill.enable();
    });
  }, [quill, docId]);

  // // Save Doc
  const saveDoc = () => {
    socket.emit("save-doc", quill.getContents());
    console.log("save");
    getDocThumbnail();
  };
  const debounce_saveDoc = _.debounce(saveDoc, 1000);

  // // Socket and Quill
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
      // Need to remove the Toolbar while unmounting
      
      const rootElement = document.getElementById("root");
      /**
       * Modified the code because it was causing some issues.
       * The problem was that the previous code was altering the innerHTML of the root element.
       * This was resulting in a blank page appearing when navigating back to the home page.
       * The new solution now only removes the necessary element and does not completely change the entire root element.
       */
      rootElement?.children[0].remove();
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
        if (source == "api") return;
        if (source == "user") {
          const content: DeltaOperation = quill.getContents();

          isConnected && socket.emit("text-change", content);

          debounce_saveDoc();
        }
      }
    );

    socket.on("text-changed", (content: DeltaOperation) => {
      quill.setContents(content);
    });
  }

  return <div id="container">Hello</div>;
}