import React, { useState } from "react";
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

import { docType } from "./Home";
import { CHANGE_DOC_NAME } from "../../Graphql/mutations";
import toast from "react-hot-toast";

const options = ["Change Name", "Shared With"];

export default function MenuButton({ doc }: { doc: docType }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose: () => void = () => {
    setAnchorEl(null);
  };

  const handleOnClick = (option: string) => {
    if (option === options[0]) {
      toggleModal();
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [changeName, { data, error, called, reset }] =
    useMutation(CHANGE_DOC_NAME);

  const handleChangeName = () => {
    const emailId = localStorage.getItem("email");

    changeName({
      variables: {
        docId: doc.docId,
        emailId,
        docName: newName,
      },
    });
    toggleModal();
    handleClose();
  };
  if (data?.changeName) {
    toast.success("Name Changed Successfully");
  }
  if (called && error) {
    toast.error(error?.message);
    reset();
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

      {/* Modal */}
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
            width: "30%",
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
    </>
  );
}
