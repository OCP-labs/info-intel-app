import React, { useContext, useState } from "react";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AuthContext from "./context/AuthContext";
import { ResultsModal } from "./ResultsModal";

export const InfoIntel = (props) => {
  const { selectedFile, setSelectedFile } = props;
  const { accessToken, authFetch } = useContext(AuthContext);

  const [ results, setResults ] = useState();
  const [ resultsModalOpen, setResultsModalOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const extractFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData
    }
    const response = await authFetch('api/mtm-gateway-api/services/mrgservice/v1/extract', requestOptions);
    if (response.ok) {
      const responseJson = await response.json();
      setResults(responseJson);
      setResultsModalOpen(true);
      console.log(responseJson);
    }
    setLoading(false);
  }

  const classifyFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData
    }
    const response = await authFetch('api/mtm-gateway-api/services/mrgservice/v1/classify', requestOptions);
    if (response.ok) {
      const responseJson = await response.json();
      setResults(responseJson);
      setResultsModalOpen(true);
      console.log(responseJson);
    }
    setLoading(false);
  }

  const processFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData
    }
    const response = await authFetch('api/mtm-gateway-api/services/mrgservice/v1/process', requestOptions);
    if (response.ok) {
      const responseJson = await response.json();
      setResults(responseJson);
      setResultsModalOpen(true);
      console.log(responseJson);
    }
    setLoading(false);
  }

  return (
    <>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center", 
        alignItems: "center",
        gap: 4, 
        position: "relative",
        top: 50,
        width: "100%",
        height: "100%" 
      }}>
        <Button 
          variant="contained" 
          component="label" 
          onClick={() => extractFile(selectedFile)}
          sx={{ width: { xs: "50%", md: "20%" }, height: "15%" }}
        >
          Extract
        </Button>
        <Button 
          variant="contained" 
          component="label" 
          onClick={() => classifyFile(selectedFile)}
          sx={{ width: { xs: "50%", md: "20%" }, height: "15%" }}
        >
          Classify
        </Button>
        <Button 
          variant="contained" 
          component="label" 
          onClick={() => processFile(selectedFile)}
          sx={{ width: { xs: "50%", md: "20%" }, height: "15%" }}
        >
          Process
        </Button>
        <IconButton sx={{ 
          position: "absolute", 
          right: {xs: 50, md: 100, xl: 250}, 
          padding: "0px", 
          minHeight: "0px", 
          minWidth: "0px" 
        }} 
          onClick={() => setSelectedFile()}>
          <RestartAltIcon />
        </IconButton>
      </Box>
      {loading && <CircularProgress sx={{ position: "absolute", top: {xs: 400, md: 300} }} />}
      <ResultsModal resultsModalOpen={resultsModalOpen} setResultsModalOpen={setResultsModalOpen} results={results} />
    </>
  )
}