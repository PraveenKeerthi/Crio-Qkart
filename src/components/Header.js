import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {Link} from "react-router-dom"
import { Typography } from "@mui/material";

const Header = ({ children, hasHiddenAuthButtons }) => {
    function logOutFn(){
      localStorage.clear()
      window.location.reload();
    }
    let logOut=((children==null)?false:true)
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
          <div>
          {
            logOut && 
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src="avatar.png" alt={children}></Avatar>
              <Typography className="username-text">{children}</Typography>
              <Button variant="text" onClick={logOutFn} className='button'>LOGOUT</Button>
              </Stack>
          }
          {
          !(hasHiddenAuthButtons || logOut) &&
            <div>
              <Link to='/login' className="linkStyle"><Button variant="text">LOGIN</Button></Link>
              <Link to='/register' className="linkStyle"><Button variant="contained">REGISTER</Button></Link>
            </div>
          }
          {
            hasHiddenAuthButtons && 
            <Link to='/' className="linkStyle">
              <Button
              className="explore-button"
              startIcon={<ArrowBackIcon />}
              variant="text"
              >
                Back to explore
              </Button>
            </Link>
          }
          </div>
      </Box>
    );
};

export default Header;
