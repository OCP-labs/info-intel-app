import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AuthContext from "./context/AuthContext";
import { ExtractResults } from "./ExtractResults";
import { ClassifyResults } from "./ClassifyResults";
import { ProcessResults } from "./ProcessResults";

export function ResultsModal(props) {
    const { resultsModalOpen, setResultsModalOpen, results, setResults, selectedFile, currentEndpoint, setCurrentEndpoint } = props;
    const { accessToken, authFetch } = useContext(AuthContext);

    const [ fileType, setFileType ] = useState("");
    const [ extractedText, setExtractedText ] = useState();
    const [ noTextFound, setNoTextFound ] = useState();
    const [ isReclassified, setIsReclassified ]= useState(false);
    const [ loading, setLoading ] = useState(false);

    const prevSelectedFile = useRef(selectedFile);

    useEffect(() => {
        if (results) {
            if (results.hasOwnProperty("header")) {
                const imageResults = results.results.ia;
                if (imageResults.status.message === "SUCCESS") {
                    setFileType("image");
                    setIsReclassified(false);
                } else if (selectedFile.type.includes("audio")) {
                    setFileType("audio");
                    setIsReclassified(false);
                } else {
                    setFileType("other");
                }
            } else if (results.riskClassification) {
                const imageResults = results.riskClassification.result.image;
                if (imageResults.length) {
                    setFileType("image");
                    setIsReclassified(false);
                } else if (selectedFile.type.includes("audio")) {
                    setFileType("audio");
                    setIsReclassified(false);
                } else {
                    setFileType("other");
                }
            } else {
            }
        }

        if (prevSelectedFile.current !== selectedFile) {
            setExtractedText("");
            setNoTextFound(false);
            prevSelectedFile.current = selectedFile;
        }
    }, [results, selectedFile])

    const runOCR = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('File', file);
        const requestOptions = {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` },
          body: formData
        }
        console.log("Running OCR.")
        const response = await authFetch('api/extract?action=ocr', requestOptions);
        if (response.ok) {
            const responseJson = await response.json();
            if (responseJson.riskExtraction.results["idol-ocr"].result) {
                const text = responseJson.riskExtraction.results["idol-ocr"].result.results;
                if (!text) {
                    setNoTextFound(true);
                    console.log("No text found in image.")
                } else {
                    setNoTextFound(false);
                    setExtractedText(text);
                }
            } else {
                setLoading(false);
                throw new Error("Server error.")
            }
        }
        setLoading(false);
    }

    const runSpeechToText = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('File', file);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData
        }
        console.log("Running speech to text.")
        const response = await authFetch('api/extract?action=audio', requestOptions);
        if (response.ok) {
            const responseJson = await response.json();
            const text = responseJson.riskExtraction.results["idol-stt"].result.results;
            if (!text) {
                setNoTextFound(true);
                console.log("No text found in audio file.")
            } else {
                setNoTextFound(false);
                setExtractedText(text);
            }
        }
        setLoading(false);
    }

    const reanalyzeFile = async (text, endpoint) => {
        setLoading(true);
        const blob = new Blob([text], { type: 'text/plain' });
        const file = new File([blob], "name");
        const formData = new FormData();
        formData.append('File', file);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData
        }
        const response = await authFetch(`api/${endpoint}`, requestOptions);
        if (response.ok) {
            const responseJson = await response.json();
            setIsReclassified(true);
            setResults(responseJson);
        }
        setLoading(false);
    }

    const createButton = () => {
        if (currentEndpoint === "extract" || fileType === "other") {
            return <div></div>;
        } else if ((fileType === "image" || fileType === "audio") && noTextFound) {
            return <Box sx={{ fontSize: "1rem", ml: "1rem", mt: "0.25rem" }}>No text found</Box>;
        } else if ((fileType === "image" || fileType === "audio") && !extractedText) {
            return <Button variant="contained" component="label" onClick={() => {fileType === "image" ? runOCR(selectedFile) : runSpeechToText(selectedFile)}} sx={{ ml: "1rem", mt: "0.25rem" }}>{fileType === "image" ? "OCR file" : "Speech to Text"}</Button>
        } else if ((fileType === "image" || fileType === "audio") && !isReclassified) {
            return <Button variant="contained" component="label" onClick={() => reanalyzeFile(extractedText, currentEndpoint)} sx={{ ml: "1rem", mt: "0.25rem" }}>Analyze text</Button>
        }
    }

    const renderResults = () => {
        switch(currentEndpoint) {
            case "extract":
                return <ExtractResults results={results} />;
            case "classify":
                return <ClassifyResults results={results} />;
            case "process":
                return <ProcessResults results={results} />
            default:
                return <pre>{JSON.stringify(results, null, 2)}</pre>
        }
    }

    return (
        <Dialog 
            fullWidth={true} 
            sx={{ mb: "5rem" }} 
            open={resultsModalOpen}
            closeAfterTransition={false}
            onClose={() => {setResultsModalOpen(!resultsModalOpen); setCurrentEndpoint("");}}
        >
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                <Box>Results</Box>
                {resultsModalOpen && createButton()}
                {loading && <CircularProgress size="2rem" sx={{ ml: "1rem", mt: "0.25rem" }} />}
                </Box>
            </DialogTitle>
            <DialogContent>
                {resultsModalOpen && renderResults()}
            </DialogContent>
        </Dialog>
    )
}