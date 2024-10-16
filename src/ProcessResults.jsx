import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";

export const ProcessResults = (props) => {
    const { results } = props;

    const [ pii, setPii ] = useState();
    const [ imageClass, setImageClass ] = useState();

    useEffect(() => {
        if (results) {
            if (results.results.ia.result) {
                const imageClass = Object.keys(results.results.ia.result.result)[0];
                console.log(imageClass);
                setImageClass(imageClass);
            } else if (results.results.tme.result) {
                setImageClass(null);
                const extractedTerms = results.results.tme.result.results.nfinder[0].nfExtract[0].extractedTerm;
                const piiObject = createPiiObject(extractedTerms);
                setPii(piiObject);
            } else {
                setImageClass(null);
                setPii(null);
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

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            { imageClass ?
            <Box>Your image contains <span style={{ fontWeight: "bold" }}>{imageClass}</span></Box>
            :
            pii === null ?
            <Box sx={{ color: "red" }}>No PII found.</Box>
            :
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Terms</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { pii && 
                        Object.entries(pii).map(([key, value]) => {
                            return <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value.length > 1 ? value.join(", ") : value}</TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
            }   
        </Box>
    )
}