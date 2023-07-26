import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function ShowAllDocs() {
  interface docType {
    _id: string;
    docId: string;
    data: string | object;
  }
  const [docs, setDocs] = useState<[docType] | null>(null);

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
          <button>
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>

      <div className="body">
        {docs &&
          docs.map((doc, index) => {
            return (
              <Link
                key={doc.docId}
                className="card"
                to={`/documents/${doc.docId}`}
              ></Link>
            );
          })}
      </div>
    </>
  );
}
