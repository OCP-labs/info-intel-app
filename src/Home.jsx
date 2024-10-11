import React, { useContext, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { InfoIntel } from './InfoIntel';
import AuthContext from "./context/AuthContext";

export const Home = (props) => {
  const { selectedFile, setSelectedFile } = props;
  const { loggedIn } = useContext(AuthContext);
  
  const [ loading, setLoading ] = useState(false);

  const handleFileSelection = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
    e.target.value = null;
  }

  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "50vh",
      width: "100vw" 
    }}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center", 
        alignItems: "center",
        gap: 4, 
        position: "absolute",
        width: "100%",
        height: "100%" 
      }}>
        {!selectedFile ? 
        <Button 
          variant="contained" 
          component="label" 
          disabled={!loggedIn}
          sx={{ width: { xs: "50%", md: "20%" }, height: "5%" }}
        >
          Choose file
          <input type="file" hidden onChange={handleFileSelection} />
        </Button>
        :
        <Box sx={{ display: "flex", justifyContent: "center", height: { xs: "20%", md: "5%" }, width: "100%" }}>
            <Typography noWrap sx={{ 
                textAlign: "center", 
                overflow: "hidden", 
                textOverflow: "ellipsis", 
                display: "inline-block", 
                width: "50%", 
                fontSize: { xs: "0.8rem", sm: "1rem" }
            }}
            >
                {selectedFile.name}
            </Typography>
        </Box>
        }
      </Box>
      {loading && <CircularProgress sx={{ position: "relative", top: 70 }} />}
      {selectedFile && <InfoIntel selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
    </Box>
  )
}