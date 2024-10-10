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

  useEffect(() => {
    checkUserStatus();
  });

  const checkUserStatus = async () => {
    const username = window.localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }

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
      throw new Error ("Something went wrong.");
    }
  }

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
      throw new Error("Something went wrong.");
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
    
  const calculateTimeOfTokenExpiration = (currentTimeMilliseconds, expiresInSeconds) => {
    const expiresInMilliseconds = expiresInSeconds * 1000;
    const expiresAtMilliseconds = currentTimeMilliseconds + expiresInMilliseconds;
    return expiresAtMilliseconds;
  }

  return (
    <AuthContext.Provider value={{username, setUsername, password, setPassword, accessToken, setAccessToken, getAccessToken, authFetch, loggedIn, setLoggedIn}}>
      <Header loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen}  />
      <Home />
      <LoginModal loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
    </AuthContext.Provider>
  );
}

export default App;