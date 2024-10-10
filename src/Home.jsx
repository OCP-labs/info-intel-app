import React, { useContext, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { InfoIntel } from './InfoIntel';
import AuthContext from "./context/AuthContext";

export const Home = (props) => {
  const { selectedFile, setSelectedFile } = props;
  const { loggedIn } = useContext(AuthContext);
  
  const [ loading, setLoading ] = useState(false);

  const handleFileSelection = async (e) => {
    if (e.target.files[0]) {
      //setLoading(true);
      const file = e.target.files[0];
      setSelectedFile(file);
      //await extractFile(file);
    }
    e.target.value = null;
  }

  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "30vh",
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
        {!selectedFile && 
        <Button 
          variant="contained" 
          component="label" 
          disabled={!loggedIn}
          sx={{ width: { xs: "50%", md: "20%" }, height: "5%" }}
        >
          Choose file
          <input type="file" hidden onChange={handleFileSelection} />
        </Button>
        }
      </Box>
      {loading && <CircularProgress sx={{ position: "relative", top: 70 }} />}
      {selectedFile && <InfoIntel selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
    </Box>
  )
}