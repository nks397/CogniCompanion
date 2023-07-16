import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
    // Box,
    Typography,
    Container,
  } from "@mui/material";

  const welcomeContainer = {
    // margin: ,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "30vh",
    // backgroundColor: "#00225B",
    color: "#FFCF40",
    // color: "#FFCF40",
    borderRadius: "10px 10px 0 0"
    // backgroundColor: "#FFCF40",
    //   color: "#00225B"
  };

export default function Welcome() {
// maybe change design
    return (
        <Container className="welcomeContainer" sx={welcomeContainer}>
           {/* <Typography variant="h4">
                Welcome to CogniCompanion!
            </Typography>  */}
            {/* icon or logo goes here or in the top left corner */}
            {/* <Typography>
                Created to help improve the lives of the cognitive impaired.
            </Typography> */}
        </Container>
    )
}