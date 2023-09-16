import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import Logo from "../assets/Google_Docs.max-2800x2800-1 (1).svg";

export default function Home() {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const URL = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

  window.onclick = (event) => {
    const modal: any = modalRef.current;
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  interface docType {
    _id: string;
    docId: string;
    email: string;
    data: string | object;
    thumbnail?: string | null;
  }

  const [docs, setDocs] = useState<[docType] | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const toggleModal = () => {
    const modal: any = modalRef.current;

    let displayProperty = modal.style.display;
    if (displayProperty === "block") return (modal.style.display = "none");
    modal.style.display = "block";
  };

  const addDoc = async () => {
    const docId = inputValue;
    const email = localStorage.getItem("email");

    const response = await axios.post(`http://${URL}/api/doc/add-doc`, {
      docId,
      email,
    });

    if (!response.data.success) return console.log("Internal Server Error");
    navigate(`/documents/${docId}`);
  };

  const createNewDoc = async () => {
    const newDocId = uuidv4();
    const email = localStorage.getItem("email");

    const response = await axios.post(
      `http://${URL}/api/doc/create-doc`,
      { newDocId, email }
    );

    if (!response.data.success) return console.log("Internal Server Error");
    navigate(`/documents/${newDocId}`);
  };

  useEffect(() => {
    const getAllDocs = async () => {
      const email = localStorage.getItem("email");
      const authToken = localStorage.getItem("auth-token");

      const response = await axios.post(
        `http://${URL}/api/doc/get-all-docs`,
        { email, authToken }
      );

      const docs = response.data.docs;
      if (!docs) return;

      setDocs(docs);
    };
    getAllDocs();
  }, []);

  return (
    <>
      {/* New Doc Modal */}
      <div id="myModal" className="modal" ref={modalRef}>
        <div className="modal-content">
          <span className="close" onClick={toggleModal}>
            &times;
          </span>
          <p className="modal-title">Create Doc</p>
          <hr />
          <div className="modal-body">
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste your Doc Id here"
              />
              <div>
                <button onClick={addDoc} className="submit">
                  Submit
                </button>
                <button onClick={createNewDoc} className="create">
                  Create New Doc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="nav">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
          <div>
            <img src={Logo} alt="" />
          </div>
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
          <button onClick={toggleModal}>
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>

      {/* Docs */}
      <div className="body" id="docs">
        {docs ? (
          docs.length > 0 ? (
            docs.map((doc) => {
              return (
                <div className="card" key={doc._id}>
                  <div
                    className="card-body"
                    style={{
                      background: `${
                        doc.thumbnail ? `url(${doc.thumbnail})` : "white"
                      }`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/documents/${doc.docId}`);
                    }}
                  ></div>
                  <div
                    className="card-metadata"
                    onClick={() => navigator.clipboard.writeText(doc.docId)}
                  >
                    Share
                  </div>
                </div>
              );
            })
          ) : (
            <p>
              Welcome! Start by creating a new document to get going. Click the
              button in top right corner to begin crafting your content.
            </p>
          )
        ) : (
          <p>Loading Docs...</p>
        )}
      </div>
    </>
  );
}
