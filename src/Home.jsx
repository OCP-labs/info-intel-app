import React, { useContext, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AuthContext from "./context/AuthContext";

export const Home = () => {
  const { loggedIn, accessToken, authFetch } = useContext(AuthContext);

  const [ selectedFile, setSelectedFile ] = useState();
  const [ loading, setLoading ] = useState(false);

  const handleFileSelection = async (e) => {
    if (e.target.files[0]) {
      setLoading(true);
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
    const response = await authFetch('api/mtm-gateway-api/services/mrgservice/v1/extract', requestOptions);
    const responseJson = await response.json();
    console.log(responseJson);
    setLoading(false);
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          <Button 
            variant="contained" 
            component="label" 
            disabled={!loggedIn}
            sx={{ position: "absolute" }}
          >
            Choose file
            <input type="file" hidden onChange={handleFileSelection} />
          </Button>
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          {loading && <CircularProgress sx={{ position: "absolute" }} />}
        </Grid>
      </Grid>
    </Box>
  )
}