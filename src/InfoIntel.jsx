import React, { useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ResultsModal } from "./ResultsModal";

export const InfoIntel = (props) => {
  const { selectedFile, setSelectedFile } = props;
  const { user } = useAuth();

  const [ results, setResults ] = useState();
  const [ currentEndpoint, setCurrentEndpoint ] = useState();
  const [ resultsModalOpen, setResultsModalOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const extractFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.access_token}` },
      body: formData
    }
    console.log("Calling /extract")
    const response = await fetch('api/extract', requestOptions);
    if (response.ok) {
      const responseJson = await response.json();
      setResults(responseJson);
      setResultsModalOpen(true);
    } else {
      setLoading(false);
      throw new Error("Something went wrong");
    }
    setResultsModalOpen(true);
    setCurrentEndpoint("extract");
    setLoading(false);
  }

  const classifyFile = async (file) => {
    setLoading(true);
    /*
    TODO: Add a POST request to the InfoIntel /classify endpoint 
    */
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.access_token}` },
      body: formData
    }
    console.log("Calling /classify")
    const response = await fetch('api/classify', requestOptions);
    if (response.ok) {
      const responseJson = await response.json();
      setResults(responseJson);
    } else {
      setLoading(false);
      throw new Error("Something went wrong");
    }
    setResultsModalOpen(true);
    setCurrentEndpoint("classify");
    setLoading(false);
  }

  const processFile = async (file) => {
    setLoading(true);
    /*
    TODO: Add a POST request to the InfoIntel /process endpoint
    */
    const formData = new FormData();
    formData.append('File', file);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.access_token}` },
      body: formData
    }
    console.log("Calling /process")
    const response = await fetch('api/process', requestOptions);
    if (response.ok) {
      const responseJson = await response.json();
      setResults(responseJson);
    } else {
      setLoading(false);
      throw new Error("Something went wrong");
    }
    setCurrentEndpoint("process");
    setResultsModalOpen(true);
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
        <Tooltip title="Extract metadata">
        <Button 
          variant="contained" 
          component="label" 
          onClick={() => extractFile(selectedFile)}
          sx={{ width: { xs: "50%", md: "20%" }, height: "10%" }}
        >
          Extract
        </Button>
        </Tooltip>
        <Button 
          variant="contained" 
          component="label" 
          onClick={() => classifyFile(selectedFile)}
          sx={{ width: { xs: "50%", md: "20%" }, height: "10%" }}
        >
          Classify
        </Button>
        <Button 
          variant="contained" 
          component="label" 
          onClick={() => processFile(selectedFile)}
          sx={{ width: { xs: "50%", md: "20%" }, height: "10%" }}
        >
          Process
        </Button>
        <IconButton sx={{ 
          position: "absolute", 
          right: {xs: 35, sm: 80, md: 80, lg: 150, xl: 250}, 
          padding: "0px", 
          minHeight: "0px", 
          minWidth: "0px" 
        }} 
          onClick={() => setSelectedFile()}>
          <RestartAltIcon />
        </IconButton>
      </Box>
      {loading && <CircularProgress sx={{ position: "absolute", bottom: {xs: 350, md: 450} }} />}
      <ResultsModal resultsModalOpen={resultsModalOpen} setResultsModalOpen={setResultsModalOpen}
        results={results} setResults={setResults} selectedFile={selectedFile} currentEndpoint={currentEndpoint}
        setCurrentEndpoint={setCurrentEndpoint}
      />
    </>
  )
}