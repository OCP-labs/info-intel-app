import React, { useContext, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AuthContext from "./context/AuthContext";

export function ResultsModal(props) {
    const { resultsModalOpen, setResultsModalOpen, results, setResults, selectedFile } = props;
    const { accessToken, authFetch } = useContext(AuthContext);

    const [ currentEndpoint, setCurrentEndpoint ] = useState();
    //const [ fileType, setFileType ] = useState();
    const [ isImage, setIsImage ] = useState(false);
    const [ isAudio, setIsAudio ] = useState(false);
    const [ extractedText, setExtractedText ] = useState();
    const [ noTextFound, setNoTextFound ] = useState();
    const [ isReclassified, setIsReclassified ]= useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (results) {
            if (results.hasOwnProperty("header")) {
                setCurrentEndpoint("process");
                const imageResults = results.results.ia;
                if (imageResults.status.message === "SUCCESS") {
                    setIsImage(true);
                    setIsReclassified(false);
                } else if (selectedFile.type.includes("audio")) {
                    setIsAudio(true);
                    setIsReclassified(false);
                }
            } else if (results.riskClassification) {
                setCurrentEndpoint("classify")
                const imageResults = results.riskClassification.result.image;
                const piiResults = results.riskClassification.result.pii;
                const videoResults = results.riskClassification.result.video;
                if (imageResults.length) {
                    setIsImage(true);
                    setIsReclassified(false);
                } else if (!piiResults.length && !videoResults.length) {
                    setIsAudio(true);
                    setIsReclassified(false);
                }
            } else {
                setCurrentEndpoint("extract");
            }
        }
    }, [results])

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
            const text = responseJson.riskExtraction.results["idol-ocr"].result.results;
            if (!text) {
                setNoTextFound(true);
                console.log("No text found in image.")
            } else {
                setNoTextFound(false);
                setExtractedText(text);
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
            console.log(responseJson);
        }
        setLoading(false);
    }

    const createButton = () => {
        if ((isImage || isAudio) && noTextFound) {
            return <Box sx={{ fontSize: "1rem", ml: "1rem", mt: "0.25rem" }}>No text found</Box>;
        } else if ((isImage || isAudio) && !extractedText) {
            return <Button onClick={() => {isImage ? runOCR(selectedFile) : runSpeechToText(selectedFile)}} sx={{ ml: "1rem", mt: "0.25rem" }}>{isImage ? "OCR file" : "Speech to Text"}</Button>
        } else if ((isImage || isAudio) && !isReclassified) {
            return <Button onClick={() => reanalyzeFile(extractedText, currentEndpoint)} sx={{ ml: "1rem", mt: "0.25rem" }}>Analyze text</Button>
        } else if (isImage || isAudio) {
            return <div></div>
        }
    }

    return (
        <Dialog fullWidth={true} sx={{ mb: "5rem" }} open={resultsModalOpen} onClose={() => setResultsModalOpen(!resultsModalOpen)}>
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                <Box>Results</Box>
                {createButton()}
                {loading && <CircularProgress size="2rem" sx={{ ml: "1rem", mt: "0.25rem" }} />}
                </Box>
            </DialogTitle>
            <DialogContent>
                <pre>{JSON.stringify(results, null, 2)}</pre>
            </DialogContent>
        </Dialog>
    )
}