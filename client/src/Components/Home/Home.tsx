import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useLazyQuery } from "@apollo/client";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Modal, TextField } from "@mui/material";
import { toast } from "react-hot-toast";

import { ADD_DOC_MUTATION, CREATE_DOC_MUTATION } from "../../Graphql/mutations";
import { GET_ALL_DOCS_QUERY } from "../../Graphql/queries";
import Navbar from "../Navbar";
import MenuButton from "./MenuButton";
import DocSkeleton from "./DocSkeleton";

const skeleton = [1, 2, 3, 4, 5, 6];

export interface docType {
  _id: string;
  name: string;
  docId: string;
  email: [string];
  data: string | object;
  thumbnail?: string | null;
  createdAt: string;
  isShared: boolean;
}

export default function Home() {
  const navigate = useNavigate();

  enum docModeEnum {
    Create,
    Existing,
  }

  const [mode, setMode] = useState<docModeEnum>(docModeEnum.Create);
  // Mode 1
  const [docName, setDocName] = useState<string>("");
  const [newDocId, setNewDocId] = useState<string>("");
  // Mode 2
  const [docId, setDocId] = useState<string>("");
  // Modal
  const [isOpen, setIsOpen] = useState(false);

  const [addDoc, { data: addDocData }] = useMutation(ADD_DOC_MUTATION);
  const [createDoc, { data: createDocData, error, called, reset }] =
    useMutation(CREATE_DOC_MUTATION);

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
  }, [getDocs, data, token]);

  useEffect(() => {
    const newDocId = uuidv4();
    setNewDocId(newDocId);
  }, []);

  const changeMode = (currentMode: number) => {
    if (currentMode === mode) return;
    setMode(mode === 0 ? docModeEnum.Existing : docModeEnum.Create);
  };

  const toggleModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setIsOpen(!isOpen);
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
    toast.success("Successfully Added the Doc");
    navigate(`/documents/${docId}`);
  }

  const createNewDoc = async () => {
    const emailId = localStorage.getItem("email");

    createDoc({
      variables: {
        docId: newDocId,
        emailId,
        docName,
      },
    });
  };
  if (createDocData?.createDoc) {
    toast.success("Successfully Created New Doc");
    navigate(`/documents/${newDocId}`);
  }
  if (called && error) {
    toast.error(error.message);
    reset();
  }

  return (
    <>
      {/* Navbar */}
      <Navbar toggleModalProp={() => toggleModal()} />

      {/* Docs */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {data?.getAllDocs ? (
            data.getAllDocs.length > 0 ? (
              data?.getAllDocs.map((doc: docType) => (
                <Grid item key={doc._id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid silver",
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        pt: "70.25%",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                        backgroundPositionY: "0",
                      }}
                      image={doc.thumbnail ? doc.thumbnail : undefined}
                      onClick={() => {
                        navigate(`/documents/${doc.docId}`);
                      }}
                    />
                    <CardContent
                      sx={{ flexGrow: 1 }}
                      style={{
                        borderTop: "1px solid silver",
                        backgroundColor: "#f3f3f3",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        style={{
                          fontSize: "1rem",
                          fontWeight: "normal",
                          overflow: "hidden",
                          height: "25px",
                        }}
                      >
                        {doc.name}
                      </Typography>
                      <Typography
                        component="p"
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "normal",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Created At: {doc.createdAt}
                        {doc.isShared ? <PeopleAltOutlinedIcon /> : <></>}
                      </Typography>
                    </CardContent>
                    <CardActions
                      style={{
                        backgroundColor: "#f3f3f3",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            navigate(`/documents/${doc.docId}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigator.clipboard.writeText(doc.docId)
                          }
                        >
                          Share
                        </Button>
                      </Box>
                      <MenuButton doc={doc} />
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>
                Welcome! Start by creating a new document to get going. Click
                the button in top right corner to begin crafting your content.
              </Typography>
            )
          ) : (
            skeleton.map((e) => {
              return <DocSkeleton key={e} />;
            })
          )}
        </Grid>
      </Container>

      {/* New Doc Modal */}
      <Modal
        open={isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            borderRadius: "0.5rem",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            width: "50%",
            position: "relative",
          }}
        >
          <Button
            onClick={toggleModal}
            sx={{
              maxWidth: "fit-content",
              position: "absolute",
              right: "0",
              top: "0",
            }}
          >
            <CloseIcon color="primary"></CloseIcon>
          </Button>
          <Box component="div" sx={{ display: "flex", gap: "10px" }}>
            <Button
              type="button"
              variant={mode === 0 ? "outlined" : "text"}
              sx={{ mt: 3, mb: 2, width: "50%" }}
              onClick={() => changeMode(0)}
            >
              Create New Doc
            </Button>
            <Button
              type="button"
              variant={mode === 1 ? "outlined" : "text"}
              sx={{ mt: 3, mb: 2, width: "50%" }}
              onClick={() => changeMode(1)}
            >
              Existing Doc
            </Button>
          </Box>
          <Box component="form" noValidate>
            {mode === 0 ? (
              <TextField
                margin="normal"
                required
                fullWidth
                id="docName"
                label="Doc Name"
                name="docName"
                autoFocus
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            ) : (
              <TextField
                margin="normal"
                required
                fullWidth
                id="docId"
                label="Paste Doc Id here"
                name="docId"
                autoFocus
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
              />
            )}
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={mode === 0 ? createNewDoc : addDocFunc}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
