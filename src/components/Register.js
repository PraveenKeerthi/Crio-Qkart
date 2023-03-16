import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory } from "react-router-dom";
import "./Register.css";


const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [cnfPassword,setCnfPassword]=useState('')
  const [displayLoadBtn,setDisplayLoadBtn]=useState(false)
  let history=useHistory();
  // const formData={uname:username,pwd:password,cnfPwd:cnfPassword}


  

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    
    setDisplayLoadBtn(true)
    // <workspace-ip>:8082/api/v1/auth/register;
    // console.log(`${config.endpoint}/register`);
    let mess;
    let stat;
    try{
      const res=await axios.post(`${config.endpoint}/auth/register`,formData)
      if(res.status===201){
        mess="Registered successfully"
        stat="success"
        history.push("/login")
      }
    }catch(e){
      if(e.response.status===400){
      mess=e.response.data.message;
      }else{
        mess="Something went wrong. Check that the backend is running, reachable and returns valid JSON."
      }
      stat='error'
    }
    enqueueSnackbar(mess,{variant:stat})
    
    if(mess==="Regi")
    setDisplayLoadBtn(false)
    
    // const data=res.data();
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */


    /**
      * @param {{username:string,password:string,confirmPassword:string}} data
      *  @return {boolean}
    */
    
  const validateInput = async (data) => {
    if(data.username.length===0){
      enqueueSnackbar('Username is a required field',{variant:'warning'})
    }
    else if(data.username.length <6 ){
      enqueueSnackbar("Username must be at least 6 characters",{variant:'warning'})
    }
    else if(data.password.length===0){
      enqueueSnackbar("Password is a required field",{variant:'warning'})
    }
    else if(data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{variant:'warning'})
    }
    else if(data.password!==cnfPassword){
      enqueueSnackbar("Passwords do not match",{variant:'warning'})
    }else{
    register(data)
    }


  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={(e)=>setUsername(e.target.value)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e)=>setPassword(e.target.value)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={(e)=>setCnfPassword(e.target.value)}
          />
            <div>
              {displayLoadBtn
              &&
              <div className="loader">
                <CircularProgress color='success'/>
              </div>
              }
              {
              !(displayLoadBtn) 
              &&
              <Button className="button" variant="contained" onClick={()=>validateInput({username,password})}>
                Register Now
              </Button>
              }
            </div>
          
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
