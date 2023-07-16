// import React from "react"
// import Chat from "./Chat"
// import { TextField, Button, Box, Typography, Link, Container } from '@mui/material'
import Navbar from "../components/Navbar"
import { Box, Typography, Card } from "@mui/material"
import { Link } from "react-router-dom"

export default function Home() {

    const options = [
        {name: "Games", link: "/games"},
        {name: "Meds", link: "/meds"},
        {name: "Location Tracker", link: "/location-tracker"},
        {name: "Mood Tracker", link: "/mood-tracker"},
    ]

    const optionsCard = {
        display: "flex",
        // justifyContent: "space-around",
        alignItems: "center",
        margin: "3vh 10vh", 
        padding: "3vh",
        justifyContent: "center",
        backgroundColor: "#00225B",
        color: "#FFCF40",
        "&:hover": {
            backgroundColor: "#FFCF40",
            color: "#00225B",
            cursor: "pointer"
        }
    }

    return(
        <Box>
            <Navbar />

            {
                options.map((item, index) => 
                    <Link key={index} to={item.link} style={{textDecoration: "none"}}>
                        <Card sx={optionsCard}>
                            <Typography>
                                    {item.name}
                            </Typography>
                        </Card>
                    </Link>
                    )
                }
        </Box>
    )
}