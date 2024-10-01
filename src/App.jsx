import React from "react";
import {  AuthProvider } from 'react-oauth2-code-pkce';
import authConfig from "./app-config/authConfig";
import { Home } from "./Home";
import { Header } from "./Header";
import "./App.css";

const App = () => {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}

export default App;
