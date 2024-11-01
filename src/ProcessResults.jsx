import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";

export const ProcessResults = (props) => {
    const { results } = props;

    const [ pii, setPii ] = useState();
    const [ imageClass, setImageClass ] = useState();
    const [ error, setError ] = useState(false);

    useEffect(() => {
        if (results) {
            // Checking for image analysis results
            if (!results.results.ia.result) {

                // Checking for PII results
                if (!results.results.tme.result) {
                    setPii(null);
                    setError(true); // If both image and text analysis results are empty, then an error has occurred or an incompatible file has been sent.
                } else if (results.results.tme.result.results.nfinder[0].nfExtract[0].extractedTerm.length) {
                    /*
                    TODO: 
                    Parse the JSON response in the results prop to create a new object of the following form:
                    {
                        <cartidgeID_1>: [value1, value2, value3...],
                        <cartridgeID_2>: [value1],
                        <cartridgeID_3>: [value1, value2],
                        ...
                    }
                    Set pii state to this new object, i.e., setPii(myPiiObject). The pii state variable 
                    will be used to display the extracted values in tabular form.
                    */

                    const extractedTerms = results.results.tme.result.results.nfinder[0].nfExtract[0].extractedTerm;
                    const piiObject = createPiiObject(extractedTerms);
                    setPii(piiObject);

                // The text of the file was successfully processed, but no PII was found. 
                } else {
                    setPii(null);
                }
                setImageClass(null);
            } else {
                const imageClass = Object.keys(results.results.ia.result.result)[0];
                setImageClass(imageClass);
            }
        }
    }, [results]);

    const createPiiObject = (extractedTermsArray) => {
        let piiObject = {};
        extractedTermsArray.forEach(term => {
            const cartridge = term.cartridgeID;
            let newValue;
            if (term.nfinderNormalized){
                newValue = term.nfinderNormalized;
            } else if (term.mainTerm) {
                newValue = term.mainTerm.value;
            } else {
                newValue = term.clientNormalized;
            }
            if (piiObject.hasOwnProperty(cartridge)) {
                const oldValue = piiObject[cartridge];
                const newValues = oldValue.concat(newValue);
                piiObject[cartridge] = newValues;
            } else {
                piiObject[cartridge] = [newValue];
            }
        })
        return piiObject;
    }

    const createResultsTable = () => {
        if (imageClass) {
            return <Box>Your image contains <span style={{ fontWeight: "bold" }}>{imageClass}</span></Box>
        } else if (pii === null && error) {
            return <Box>File content was not processed. This could be due to an unsupported language or file type.</Box>
        } else if (pii === null) {
            return <Box sx={{ color: "red" }}>No PII found.</Box>
        } else if (pii) {
            return <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Terms</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        Object.entries(pii).map(([key, value]) => {
                            return <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value.length > 1 ? value.join(", ") : value.length ? value : null}</TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        } else {
            return <></>
        }
    }

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            {createResultsTable()}
        </Box>
    )
}