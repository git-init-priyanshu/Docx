import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/Google_Docs.max-2800x2800-1 (1).svg";

export default function Navbar({
  toggleModalProp,
}: {
  toggleModalProp: () => void;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");

    navigate("/");
  };
  return (
    <Box component="div" className="nav">
      <Box component="div" className="nav-header">
        <Box component="div">
          <img src={Logo} alt="" />
        </Box>
        <Box component="div" className="nav-title">
          Docx
        </Box>
      </Box>
      {/* Search*/}
      <Box component="div" className="search-bar">
        <span className="material-symbols-outlined">search</span>
        <input type="text" name="searchBar" placeholder="Search" />
      </Box>
      {/* Hamburger */}
      <Box component="div" className="nav-btn">
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </Box>

      <Box
        component="div"
        sx={{ display: "flex", gap: "10px", marginRight: "10px" }}
      >
        {/* Create Doc */}
        <Button variant="contained" onClick={toggleModalProp}>
          <NoteAddOutlinedIcon />
        </Button>
        {/* Logout */}
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px", alignItems: "center" }}
          onClick={handleLogout}
        >
          <LogoutOutlinedIcon />
        </Button>
      </Box>
    </Box>
  );
}
