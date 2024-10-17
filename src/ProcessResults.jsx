import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";

export const ProcessResults = (props) => {
    const { results } = props;

    const [ pii, setPii ] = useState();
    const [ imageClass, setImageClass ] = useState();
    const [ error, setError ] = useState(false);

    useEffect(() => {
        if (results) {
            if (results.results.ia.result) {
                const imageClass = Object.keys(results.results.ia.result.result)[0];
                console.log(imageClass);
                setImageClass(imageClass);
            } else if (results.results.tme.result) {
                if (results.results.tme.result.results.nfinder[0].nfExtract[0].extractedTerm.length) {
                    setImageClass(null);
                    const extractedTerms = results.results.tme.result.results.nfinder[0].nfExtract[0].extractedTerm;
                    const piiObject = createPiiObject(extractedTerms);
                    setPii(piiObject);
                } else {
                    setImageClass(null);
                    setPii(null);
                }
            } else {
                setImageClass(null);
                setPii(null);
                setError(true);
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
            return <Box>Unsupported language or file type.</Box>
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
        }
    }

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            {createResultsTable()}
        </Box>
    )
}