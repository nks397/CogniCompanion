import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserProvider";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Typography,
  Modal,
  Menu,
  MenuItem,
  Tooltip,
  Toolbar,
  Card,
} from "@mui/material";
// import ChangeProfilePic from "./ChangeProfilePic"
// import chatAwayPic from "../assets/Chat-Away-lg.png"
import { Link } from "react-router-dom";
import Hamburger from "hamburger-react";
import { useMediaQuery } from 'react-responsive';

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState<EventTarget | null>(null);
  const [anchorElMenu, setAnchorElMenu] = useState<EventTarget | null>(null);

  const {
    signOutOfAccount,
    currentUser,
    onOpenModal,
    onCloseModal,
    open,
    photoURL,
  } = useContext(UserContext);

  const [isOpen, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 900 });

  function handleOpenUserMenu(e: React.FormEvent<EventTarget>) {
    setAnchorElUser(e.currentTarget);
  }
  
  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }
  function handleOpenNavMenu(e: React.FormEvent<EventTarget>) {
    setAnchorElMenu(e.currentTarget);
  }
  function handleCloseNavMenu() {
    setAnchorElMenu(null);
  }

  const appBarStyle = {
    backgroundColor: "#00225B",
    // color: "white",
    // color: "#FFCF40",
  };

  const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "8vw",
    // backgroundColor: "#f2f2f2",
    border: "1px solid #000",
    borderRadius: "2px",
    boxShadow: "4px 2px 5px 0px rgba(0,0,0,0.52)",
  };

  const textStyle = {
    textAlign: "center",
  };

  const navOptions = [
    { name: "Games", link: "/games" },
    { name: "Meds", link: "/meds" },
    { name: "Location Tracker", link: "/location-tracker" },
    { name: "Mood Tracker", link: "/mood-tracker" },
  ];

  const desktopNavLinkStyle = {
    textDecoration: "none",
    color: "white",

  };
  const mobileNavLinkStyle = {
    textDecoration: "none",
    color: "black",
    // display: "flex",
    
  };
  console.log(isSmallScreen, "small")

  //if pg size is less than 900, display icon

  return (
    <AppBar position="static" sx={appBarStyle}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              justifyContent: "space-between",
            }}
          >
            {navOptions.map((item, index) => (
              <Link key={index} to={item.link} style={desktopNavLinkStyle}>
                <Typography>{item.name}</Typography>
              </Link>
            ))}
            {/* <img src={chatAwayPic} style={{height: "50px"}} alt="" /> */}
          </Typography>
          {isSmallScreen ?
          <>
          <Tooltip title="Open Menu">
            <IconButton onClick={handleOpenNavMenu} sx={{ p: 0 }}>
              <Hamburger color="white" toggled={isOpen} toggle={setOpen} />
            </IconButton>
          </Tooltip>
          <Menu
              sx={{ mt: "45px", display: { md: "none" }}}
              id="menu-appbar"
              anchorEl={anchorElMenu as Element}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElMenu)}
              onClose={handleCloseNavMenu}
            >
          <MenuItem>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              justifyContent: "space-around",
              flexDirection: "column"
            }}
          >
            {navOptions.map((item, index) => (
              <Link key={index} to={item.link} style={mobileNavLinkStyle}>
                <Typography sx={{
                  "&:hover": {
                  color: "#00225B",
                  backgroundColor: "#FFCF40"
                }}}>
                {item.name}
              </Typography>
              </Link>
            ))}
            {/* <img src={chatAwayPic} style={{height: "50px"}} alt="" /> */}
          </Typography>
          </MenuItem>
          </Menu>
          </>
          :null

        }

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={currentUser.displayName} src={photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser as Element}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={signOutOfAccount}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
              <MenuItem onClick={onOpenModal}>
                {/* <Typography textAlign="center">Change Profile Picture</Typography> */}
              </MenuItem>
              <Modal
                open={open}
                onClose={onCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={boxStyle}>
                  <Typography sx={textStyle} variant="h6" component="h2">
                    Profile Picture
                  </Typography>
                  {/* <ChangeProfilePic /> */}
                </Box>
              </Modal>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
