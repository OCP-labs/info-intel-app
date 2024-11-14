import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Alert, Box, CircularProgress } from '@mui/material';
import { Home } from './Home';
import { Header } from './Header';
import AuthContext from './context/AuthContext';
import './styles/App.css';

const App = () => {
  const [ accessToken, setAccessToken ] = useState();
  const [ selectedFile, setSelectedFile ] = useState();


  useEffect(() => {
    const checkForToken = async () => {
      const oldToken = window.localStorage.getItem("access_token");
      const newToken = oldToken ? oldToken : await getAccessToken();
      if (!newToken) {
        throw new Error("Something went wrong. Please check your client credentials.")
      } else {
        setAccessToken(newToken);
      }
    }
    checkForToken();
  }, []);
  
  const authFetch = async (url, options) => {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    } else if (response.status === 401) {
      const newAccessToken = await getAccessToken();
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${newAccessToken}`
      }
      const newResponse = await fetch(url, options);
      if (newResponse.ok) {
        return newResponse;
      }
    } else {
      return response;
    }
  }

  const getAccessToken = async () => {
    const body = createAuthBody();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body)
    }
    const response = await fetch('auth/oauth2/token', requestOptions);
    if (!response.ok) {
      return new Error ("Something went wrong. Please try refreshing the page")
    } else {
      const responseJson = await response.json();
      setAccessToken(responseJson.access_token);
      window.localStorage.setItem("access_token", responseJson.access_token);
      return responseJson.access_token;
    }
  }

  const createAuthBody = () => {
    const body = {
      'grant_type': 'client_credentials',
      'client_id': import.meta.env.VITE_CLIENT_ID,
      'client_secret': import.meta.env.VITE_CLIENT_SECRET,
    }
    return body;
  }

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, getAccessToken, authFetch}}>
      <Header setSelectedFile={setSelectedFile}  />
      <Home selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </AuthContext.Provider>
  );
}

export default App;