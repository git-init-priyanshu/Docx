import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { socket } from "../socket";

export default function ShowAllDocs() {
  const navigate = useNavigate();
  interface docType {
    _id: string;
    docId: string;
    data: string | object;
    thumbnail?: string | null;
  }
  const [docs, setDocs] = useState<[docType] | null>(null);

  const createDoc = () => {
    const newDocId = uuidv4();

    socket.emit("create-doc", newDocId);

    navigate(`/documents/${newDocId}`);
  };

  useEffect(() => {
    const getAllDocs = async () => {
      const docs = await axios.get("http://localhost:4000/getAllDocs");
      console.log(docs.data.data);
      setDocs(docs.data.data);
    };
    getAllDocs();
  }, []);

  return (
    <>
      <div className="nav">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
          <div className="nav-title">Docs</div>
        </div>
        {/* Search*/}
        <div className="search-bar">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search" />
        </div>
        {/* Hamburger */}
        <div className="nav-btn">
          <label htmlFor="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>

        <div className="nav-links">
          <button onClick={createDoc}>
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>

      <div className="body" id="docs">
        {docs &&
          docs.map((doc) => {
            return (
              <Link
                key={doc.docId}
                className="card"
                to={`/documents/${doc.docId}`}
                style={{
                  background: `url(${doc.thumbnail})`,
                }}
              ></Link>
            );
          })}
      </div>
    </>
  );
}
