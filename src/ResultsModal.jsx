import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import AuthContext from "./context/AuthContext";

export function ResultsModal(props) {
    const { resultsModalOpen, setResultsModalOpen, results } = props;

    const [ isImage, setIsImage ] = useState(false);

    useEffect(() => {  
    })

    

    return (
        <Dialog sx={{ mb: "5rem" }} open={resultsModalOpen} onClose={() => setResultsModalOpen(!resultsModalOpen)}>
            <DialogTitle>Results</DialogTitle>
            <DialogContent>
                <pre>{JSON.stringify(results, null, 2)}</pre>
            </DialogContent>
        </Dialog>
    )
}