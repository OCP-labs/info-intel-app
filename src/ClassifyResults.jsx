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

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Box>
                Risk Status: {results.riskClassification.header.documentRiskStatus}
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Risk Name</TableCell>
                        <TableCell>Risk Level</TableCell>
                        {riskDetails && riskDetails.pii.length > 0 && <TableCell>Frequency</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    riskDetails && riskDetails.image.length > 0 ?
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
        </Box>
    )
}