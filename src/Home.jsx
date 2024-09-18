import React, { useContext } from "react";
import { AuthContext } from 'react-oauth2-code-pkce';

export const Home = () => {
    const { token, tokenData } = useContext(AuthContext);

    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div>{JSON.stringify(tokenData, null, 2)}</div>
      </div>
    )
}