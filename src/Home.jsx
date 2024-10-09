import React, { useContext, useState } from "react";
import { Box, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AuthContext from "./context/AuthContext";

export const Home = () => {
  const [ selectedFile, setSelectedFile ] = useState();
  const { loggedIn, accessToken } = useContext(AuthContext);

  const handleFileSelection = async (e) => {
    if (e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
        await detectFile(file);
    }
    e.target.value = null;
  }

  const detectFile = async (file) => {
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData
    }
    const response = await fetch('api/mtm-gateway-api/services/mrgservice/v1/detect', requestOptions);
    const responseJson = await response.json();
    console.log(responseJson);
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          <Button 
            variant="contained" 
            component="label" 
            disabled={!loggedIn}
          >
            Choose file
            <input type="file" hidden onChange={handleFileSelection} />
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}