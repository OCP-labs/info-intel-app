import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";

export const ClassifyResults = (props) => {
    const { results } = props;

    const [ riskDetails, setRiskDetails ] = useState();

    useEffect(() => {
        if (results) {
            const risks = results.riskClassification.result;
            setRiskDetails(risks);
        }
    }, [results]);

    const getRiskStatusColor = (riskLevel) => {
        switch(riskLevel) {
            case "noRisk":
                return "black";
            case "low":
                return "green";
            case "medium":
                return "orange";
            case "high":
                return "red";
            default:
                return "black";
        }
    }

    const createTable = () => {
        if (results) {
            if (results.riskClassification.header.documentRiskStatus === "noRisk" || results.riskClassification.header.documentRiskStatus === "unknown") {
                return <></>
            } else if (riskDetails) {
                return <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Risk Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Risk Level</TableCell>
                        {riskDetails.pii.length > 0 && <TableCell sx={{ fontWeight: "bold" }}>Frequency</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    riskDetails.image.length > 0 ?
                    riskDetails.image.map((result, index) => {
                        return <TableRow key={index}>
                            <TableCell>{result.riskName}</TableCell>
                            <TableCell>{result.riskLevel}</TableCell>
                        </TableRow>
                    })
                    :
                    riskDetails && riskDetails.pii.map((result, index) => {
                        return <TableRow key={index}>
                        <TableCell>{result.riskName}</TableCell>
                        <TableCell>{result.riskLevel}</TableCell>
                        <TableCell>{result.frequency}</TableCell>
                    </TableRow>
                    })
                }
                </TableBody>
            </Table>
            }
        }
    }

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Box>
                Risk Status: {results && 
                <span style={{ color: getRiskStatusColor(results.riskClassification.header.documentRiskStatus)}}>
                    {results.riskClassification.header.documentRiskStatus}
                </span>}
            </Box>
            {createTable()}
        </Box>
    )
}