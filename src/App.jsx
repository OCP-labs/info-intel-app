import React, { useEffect, useState } from 'react';
import { Home } from './Home';
import { Header } from './Header';
import { LoginModal } from './LoginModal';
import AuthContext from './context/AuthContext';
import './styles/App.css';

const App = () => {
  const [ accessToken, setAccessToken ] = useState();
  const [ username, setUsername ] = useState();
  const [ password, setPassword ] = useState();
  const [ loggedIn, setLoggedIn ] = useState();
  const [ loginModalOpen, setLoginModalOpen ] = useState(false);
  const [ selectedFile, setSelectedFile ] = useState();


  useEffect(() => {
    const checkForToken = async () => {
      const oldToken = window.localStorage.getItem("access_token");
      const newToken = oldToken ? oldToken : await getAccessToken();
      if (!newToken) {
        throw new Error("Something went wrong. Please check your client credentials.")
      } else {
        setLoggedIn(true);
        setAccessToken(newToken);
      }
      /*
      if (currentToken) {
        setLoggedIn(true);
        setAccessToken(currentToken);
      } else {
        const newToken = await getAccessToken();
        if (newToken) {
          setLoggedIn(true);
          setAccessToken(newToken);
        } else {
          throw new Error("Something went wrong. Please check your client credentials.")
        }
      }
      */
    }
    checkForToken();
  }, []);
  /*
  const checkUserStatus = async () => {
    const currentUsername = window.localStorage.getItem('username');
    if (!currentUsername || currentUsername === 'undefined') {
      setLoggedIn(false);
      window.localStorage.clear();
    } else {
      setUsername(currentUsername);
      const currentAccessToken = window.localStorage.getItem('access_token');
      const expiresAt = parseInt(window.localStorage.getItem('expires_at'));
      const currentTime = Date.now();
      if (currentAccessToken && expiresAt && currentTime <= expiresAt) {
        setLoggedIn(true);
        setAccessToken(currentAccessToken);
      } else if (window.localStorage.getItem('refresh_token')) {
        try {
          await getAccessToken(false);
        } catch (error) {
          console.log(error);
          setLoggedIn(false);
          }
      } else {
        setLoggedIn(false);
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('expires_at');
        window.localStorage.removeItem('refresh_token');
      }
    }
  }
 
  const authFetch = async (url, options) => {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
  }
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    } else if (response.status === 401) {
      const newAccessToken = password ? await getAccessToken(true) : await getAccessToken(false);
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
  */

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

  /*
  const getAccessToken = async (usePassword) => {
    const body = createAuthBody(usePassword);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body)
    }

    const response = await fetch('auth/oauth2/token', requestOptions);
    if (!response.ok) {
      if (response.status === 400) {
        window.localStorage.clear();
        throw new Error("Refresh token has expired. Please log in again.");
      } else {
        throw new Error ("Something went wrong. Try to log in again.")
      }
    } else {
      const responseJson = await response.json();
      setAccessToken(responseJson.access_token);
      window.localStorage.setItem("username", username);
      window.localStorage.setItem("access_token", responseJson.access_token);
      window.localStorage.setItem("refresh_token", responseJson.refresh_token);
      const expiresInSeconds = responseJson.expires_in;
      const currentTimeMilliseconds = Date.now();
      const expiresAtMilliseconds = calculateTimeOfTokenExpiration(currentTimeMilliseconds, expiresInSeconds);
      window.localStorage.setItem("expires_at", expiresAtMilliseconds);
      return responseJson.access_token;
    }
  }
  */

  const createAuthBody = () => {
    const body = {
      'grant_type': 'client_credentials',
      'client_id': import.meta.env.VITE_CLIENT_ID,
      'client_secret': import.meta.env.VITE_CLIENT_SECRET,
    }
    return body;
  }

  /*
  const createAuthBody = (usePassword) => {
    let body = {
      'client_id': import.meta.env.VITE_CLIENT_ID,
      'client_secret': import.meta.env.VITE_CLIENT_SECRET,
    }
    usePassword ? body = {
      ...body,
      'grant_type': 'password',
      'username': username,
      'password': password
    }
    :
    body = {
      ...body,
      'grant_type': 'refresh_token',
      'refresh_token': window.localStorage.getItem('refresh_token')
    }
    return body;
  }
  */
    
  const calculateTimeOfTokenExpiration = (currentTimeMilliseconds, expiresInSeconds) => {
    const expiresInMilliseconds = expiresInSeconds * 1000;
    const expiresAtMilliseconds = currentTimeMilliseconds + expiresInMilliseconds;
    return expiresAtMilliseconds;
  }

  return (
    <AuthContext.Provider value={{username, setUsername, password, setPassword, accessToken, setAccessToken, getAccessToken, authFetch, loggedIn, setLoggedIn}}>
      <Header loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} setSelectedFile={setSelectedFile}  />
      <Home selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      <LoginModal loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
    </AuthContext.Provider>
  );
}

export default App;