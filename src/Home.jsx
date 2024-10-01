import React, { useContext, useState } from "react";
import { AuthContext } from 'react-oauth2-code-pkce';
import { Box, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';

export const Home = () => {
  const { token, tokenData } = useContext(AuthContext);
  const [ subscriptionRootId, setSubscriptionRootId ] = useState();

  /*
  const getSubscriptionRoot = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authentication': `Bearer ${token}`
      }
    }
    const response = await fetch('/cms/instances/folder/cms_folder', requestOptions);
    const responseJson = response.json();
    console.log(responseJson);
    //return responseJson;
  }
  */

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          <Button onClick={() => console.log("test")}>Get root</Button>
        </Grid>
      </Grid>
    </Box>
  )
}