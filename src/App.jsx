import React from "react";
import {  AuthProvider } from 'react-oauth2-code-pkce';
import authConfig from "./app-config/authConfig";
import { Home } from "./Home";

const App = () => {
  return (
      <AuthProvider authConfig={authConfig}>
        <Home />
      </AuthProvider>
  );
}

export default App;
