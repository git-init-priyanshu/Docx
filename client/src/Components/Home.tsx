import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useLazyQuery } from "@apollo/client";

import Logo from "../assets/Google_Docs.max-2800x2800-1 (1).svg";
import { ADD_DOC_MUTATION, CREATE_DOC_MUTATION } from "../Graphql/mutations";
import { GET_ALL_DOCS_QUERY } from "../Graphql/queries";

export default function Home() {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  window.onclick = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal: any = modalRef.current;
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  interface docType {
    _id: string;
    docId: string;
    email: [string];
    data: string | object;
    thumbnail?: string | null;
  }

  const [docId, setDocId] = useState<string>("");
  const [newDocId, setNewDocId] = useState<string>("");

  const [addDoc, { data: addDocData }] = useMutation(ADD_DOC_MUTATION);
  const [createDoc, { data: createDocData }] = useMutation(CREATE_DOC_MUTATION);

  const token = localStorage.getItem("token");
  const [getDocs, { data }] = useLazyQuery(GET_ALL_DOCS_QUERY, {
    variables: { token },
  });

  useEffect(() => {
    getDocs({
      variables: {
        token,
      },
    });
  }, [getDocs, token]);

  useEffect(() => {
    const newDocId = uuidv4();
    setNewDocId(newDocId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");

    navigate("/");
  };

  const toggleModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal: any = modalRef.current;

    const displayProperty = modal.style.display;
    if (displayProperty === "block") return (modal.style.display = "none");
    modal.style.display = "block";
  };

  const addDocFunc = async () => {
    const emailId = localStorage.getItem("email");

    addDoc({
      variables: {
        data: {
          docId,
          emailId,
        },
      },
    });
  };
  if (addDocData?.addDoc) {
    navigate(`/documents/${docId}`);
  }

  const createNewDoc = async () => {
    const emailId = localStorage.getItem("email");

    createDoc({
      variables: {
        data: {
          docId: newDocId,
          emailId,
        },
      },
    });
  };
  if (createDocData?.createDoc) {
    navigate(`/documents/${newDocId}`);
  }

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
                name="docId"
                type="text"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                placeholder="Paste your Doc Id here"
              />
              <div>
                <button onClick={addDocFunc} className="submit">
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
          <div className="nav-title">Docx</div>
        </div>
        {/* Search*/}
        <div className="search-bar">
          <span className="material-symbols-outlined">search</span>
          <input type="text" name="searchBar" placeholder="Search" />
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
          {/* Logout */}
          <button onClick={handleLogout}>Logout</button>
          {/* Create Doc */}
          <button onClick={toggleModal}>
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>

      {/* Docs */}
      <div className="body" id="docs">
        {data?.getAllDocs ? (
          data.getAllDocs.length > 0 ? (
            data?.getAllDocs.map((doc: docType) => {
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
                      backgroundPositionY: "0",
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
