import { useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Container,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { UserContext } from "../../context/UserProvider";
import { InputAdornment, IconButton } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Welcome from "../Welcome";
// handleSubmit={signUpWithEmail}
// userNameInputType="text"
// reEnterPasswordInputType="password"
// gridSm={6}

// remember me feature???

interface AuthFormProps {
  handleSubmit: () => void;
  userNameInputType: string;
  reEnterPasswordInputType: string;
  displayInput?: string;
  gridSm: number;
}

export default function AuthForm(props: AuthFormProps) {
  const {
    handleSubmit,
    userNameInputType,
    reEnterPasswordInputType,
    displayInput,
    gridSm,
  } = props;

  const {
    authInputs,
    authHandleChange,
    errMsg,
    isAuthToggled,
    toggleAuth,
    handleGoogleSubmit,
    showPassword,
    showReEnterPassword,
    handleClickShowPassword,
    handleClickShowReEnterPassword,
  } = useContext(UserContext);

  const mainContainer = {
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // margin: "0px 45px",
  };

  const mainBox = {
    // marginTop: 7,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)",
  };

  const formButton = {
    fontFamily: "Helvetica",
    marginTop: "5px",
    backgroundColor: "#00225B",
    // backgroundColor: "rgb(25 118 210)",
    color: "#FFCF40",
    // color: "white",
    textAlign: "center",
    boxShadow: "4px 2px 5px 0px rgba(0,0,0,0.52)",
    transform: "translateY(0px)",
    transitionDuration: ".5s",
    transitionProperty: "box-shadow, transform",
    "&:hover": {
      boxShadow: "4px 5px 5px 0px rgba(0,0,0,0.52)",
      transform: "translateY(-5px)",
      transitionDuration: ".5s",
      transitionProperty: "box-shadow, transform",
      backgroundColor: "#FFCF40",
      color: "#00225B"
    //   backgroundColor: "rgb(25 118 210)",
    },
  };

  const orText = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const errMsgText = {
    color: "red",
  };

  return (
    // <>
      <Box sx={mainBox}>
            <Welcome />

        <Typography component="h1" variant="h5">
          {isAuthToggled ? (
            <>
              <LockOutlinedIcon /> Sign Up
            </>
          ) : (
            <>
              <LockOpenOutlinedIcon /> Login
            </>
          )}
        </Typography>
        {/* <Box component="form" noValidate> */}
        <Box component="form" noValidate sx={{ margin: "20px 20px" }}>
          <Grid2 container spacing={2}>
            <Grid2
              component="div"
              xs={12}
              sm={6}
              sx={{ display: displayInput }}
            >
              <TextField
                type={userNameInputType}
                name="username"
                label="Username"
                value={authInputs.username}
                onChange={authHandleChange}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 component="div" xs={12} sm={gridSm}>
              <TextField
                type="text"
                name="email"
                label="Email"
                value={authInputs.email}
                onChange={authHandleChange}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 component="div" xs={12}>
              {/* maybe implement autocomplete for passwords */}
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                value={authInputs.password}
                onChange={authHandleChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        {/* <EmojiEmotionsIcon  onClick={() => setShowPicker(true)}/> */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Grid2 container justifyContent="flex-end">
                {/* <Grid2 component="div"> */}
                <Grid2 component="div" sx={{ marginTop: "10px" }}>
                  {/* <Link href="#" variant="body2" onClick={togglePasswordForgotten}>
                                    Forgot password?
                                </Link> */}
                  <Link href="/forgot-password">
                    <Typography>Forgot your Password?</Typography>
                  </Link>
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 xs={12} component="div" sx={{ display: displayInput }}>
              <TextField
                type={
                  reEnterPasswordInputType && showReEnterPassword
                    ? "text"
                    : "password"
                }
                name="reEnterPassword"
                label="Re-Enter Password"
                value={authInputs.reEnterPassword}
                onChange={authHandleChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowReEnterPassword}
                      >
                        {showReEnterPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                        {/* <EmojiEmotionsIcon  onClick={() => setShowPicker(true)}/> */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 component="div" xs={12}>
              <Typography variant="body2" sx={errMsgText}>
                {errMsg}
              </Typography>
            </Grid2>
            <Button
              type="submit"
              sx={formButton}
              onClick={handleSubmit}
              fullWidth
              variant="contained"
            >
              {isAuthToggled ? "Sign Up With Email" : "Login In With Email"}
            </Button>
            <Grid2 component="div" xs={12}>
              <Typography sx={orText}>or</Typography>
            </Grid2>
            <Button
              type="submit"
              sx={formButton}
              onClick={handleGoogleSubmit}
              fullWidth
              variant="contained"
            >
              {isAuthToggled ? "Sign Up With Google" : "Login In With Google"}
            </Button>
            <Grid2 container justifyContent="flex-end">
              {/* <Grid2 component="div"> */}
              <Grid2 component="div" sx={{ marginTop: "10px" }}>
                <Link href="#" variant="body2" onClick={toggleAuth}>
                  {isAuthToggled
                    ? "Already have an account? Sign in"
                    : "Don't have an account yet? Sign up"}
                </Link>
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    // </>
  );
}
