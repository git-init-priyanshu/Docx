import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { docType } from "./Home";
import { CHANGE_DOC_NAME, REMOVE_EMAIL } from "../../Graphql/mutations";
import toast from "react-hot-toast";

const options = ["Change Name", "Shared With"];

export default function MenuButton({ doc }: { doc: docType }) {
  const [emailId, setEmailId] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModal] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const emailId = localStorage.getItem("email");
    emailId && setEmailId(emailId);
  }, [emailId]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose: () => void = () => {
    setAnchorEl(null);
  };

  const handleOnClick = (option: string) => {
    if (option === options[0]) {
      toggleNameModal();
    } else {
      toggleShareModal();
    }
  };

  const toggleNameModal = () => {
    setIsOpen(!isOpen);
  };
  const toggleShareModal = () => {
    setIsShareModal(!isShareModalOpen);
  };

  const [changeName, { data, error, called, reset }] =
    useMutation(CHANGE_DOC_NAME);

  const handleChangeName = () => {
    changeName({
      variables: {
        docId: doc.docId,
        emailId,
        docName: newName,
      },
    });
    toggleNameModal();
    handleClose();
  };
  if (data?.changeName) {
    toast.success("Name Changed Successfully");
  }
  if (called && error) {
    toast.error(error?.message);
    reset();
  }

  const [
    removeEmail,
    {
      data: removeData,
      error: removeError,
      called: removeCalled,
      reset: removeReset,
    },
  ] = useMutation(REMOVE_EMAIL);

  const handleDeleteEmail = (email: string) => {
    removeEmail({
      variables: {
        docId: doc.docId,
        deleteEmail: email,
        userEmail: emailId,
      },
    });
  };
  if (removeData?.removeEmail) {
    toast.success("Email removed Successfully");
  }
  if (removeCalled && removeError) {
    toast.error(removeError?.message);
    removeReset();
  }

  return (
    <>
      <Box>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              selected={option === "Pyxis"}
              onClick={() => handleOnClick(option)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Name Modal */}
      <Modal
        open={isOpen}
        onClose={toggleNameModal}
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
            width: "30%",
            position: "relative",
          }}
        >
          <Button
            onClick={toggleNameModal}
            sx={{
              maxWidth: "fit-content",
              position: "absolute",
              right: "0",
              top: "0",
            }}
          >
            <CloseIcon color="primary"></CloseIcon>
          </Button>
          <Box>
            <Typography sx={{ fontSize: "1rem" }} component="h5">
              Set new Name
            </Typography>
            <TextField
              margin="normal"
              variant="standard"
              required
              fullWidth
              id="newName"
              label="Name"
              name="newName"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button
              onClick={handleChangeName}
              sx={{ marginTop: "1rem" }}
              variant="contained"
              fullWidth
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Share Modal */}
      <Modal
        open={isShareModalOpen}
        onClose={toggleShareModal}
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
            width: "30%",
            position: "relative",
          }}
        >
          <Button
            onClick={toggleShareModal}
            sx={{
              maxWidth: "fit-content",
              position: "absolute",
              right: "0",
              top: "0",
            }}
          >
            <CloseIcon color="primary"></CloseIcon>
          </Button>
          <Box>
            <Typography
              sx={{ fontSize: "1rem", marginBottom: "5px" }}
              component="h5"
            >
              Shared With
            </Typography>
            <Box sx={{ maxHeight: "15rem", overflowY: "scroll" }}>
              {doc.email.length > 1 ? (
                doc.email.map((email) => {
                  if (email === emailId) return;
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBlock: "5px",
                        alignItems: "center",
                      }}
                    >
                      <Typography component="p" sx={{ overflow: "hidden" }}>
                        {email}
                      </Typography>
                      <Button onClick={() => handleDeleteEmail(email)}>
                        <DeleteIcon />
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Typography component="p">
                  This doc is not shared with anyone.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
