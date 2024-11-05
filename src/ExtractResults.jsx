import React from "react";

export const ExtractResults = (props) => {
    const { results } = props;

    return (
        <pre>{JSON.stringify(results, null, 2)}</pre>
    )
}