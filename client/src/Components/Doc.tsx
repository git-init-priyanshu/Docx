import { useEffect, useState } from "react";
import Quill from "quill";
import { DeltaOperation, Sources, Quill as typesQuill } from "quill/index";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import html2canvas from "html2canvas";
import _ from "lodash";

import "quill/dist/quill.snow.css";
import { TOOLBAR_OPTIONS } from "./utils/ToolbarOptions";
import {
  CHANGE_TEXT_MUTATION,
  SAVE_DOC_MUTATION,
  SAVE_THUMBNAIL_MUTATION,
} from "../Graphql/mutations";
import { GET_DOC_DATA_QUERY } from "../Graphql/queries";
import { REFLECT_CHANGES_SUBSCRIPTION } from "../Graphql/subscriptions";

export default function Doc() {
  const { id: docId } = useParams();
  const userEmail = localStorage.getItem("email");

  const [isConnected, setIsConnected] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quill, setQuill] = useState<any>(null);

  const [saveThumbnail] = useMutation(SAVE_THUMBNAIL_MUTATION);
  const [saveDocData] = useMutation(SAVE_DOC_MUTATION);
  const [changeText] = useMutation(CHANGE_TEXT_MUTATION);

  const [getDocData, { data }] = useLazyQuery(GET_DOC_DATA_QUERY, {
    variables: { docId },
  });
  useEffect(() => {
    getDocData({
      variables: {
        docId,
      },
    });
  }, [docId, getDocData]);

  const { data: contentChange } = useSubscription(
    REFLECT_CHANGES_SUBSCRIPTION,
    {
      variables: { docId, userEmail },
    }
  );

  const toggleConnected: () => void = () => {
    setIsConnected((isConnected) => !isConnected);
  };

  const createDocThumbnail: () => void = async () => {
    const page = document.getElementById("container");

    if (!page) return;
    const canvas = await html2canvas(page, { scale: 0.5 });

    const thumbnail = canvas.toDataURL(`${docId}thumbnail/png`);

    saveThumbnail({
      variables: {
        docId,
        thumbnail,
      },
    });
  };

  // // Load Doc
  useEffect(() => {
    if (!data || !quill) return;
    quill.setContents(data.getDocData.data);
    quill.enable();
  }, [quill, data]);

  // // Save Doc
  // Why is this function triggering multiple times?
  const saveDoc = () => {
    const data = quill.getContents();
    saveDocData({
      variables: {
        docId,
        data,
      },
    });
    console.log("save");
    createDocThumbnail();
  };
  useEffect(() => {
    if (!quill) return;
    let timer: any;
    clearTimeout(timer);
    return () => {
      timer = setTimeout(() => {
        saveDoc();
      }, 1000);
    };
  }, [contentChange]);

  // const debounce_saveDoc = debounce(saveDoc, 1000);

  // // Socket and Quill
  useEffect(() => {
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
      toggleConnected();
    };
  }, []);

  if (quill) {
    quill.on(
      "text-change",
      function (
        _delta: DeltaOperation,
        _oldDelta: DeltaOperation,
        source: Sources
      ) {
        if (source == "api") return;
        if (source == "user") {
          const data: DeltaOperation = quill.getContents();
          isConnected &&
            changeText({
              variables: {
                docId,
                data,
                userEmail,
              },
            });
          // debounce_saveDoc();
        }
      }
    );
    if (contentChange) {
      quill.setContents(contentChange.reflectChanges);
    }
  }

  return <div id="container">Hello</div>;
}
