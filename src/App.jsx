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
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    checkUserStatus();
  });

  const checkUserStatus = () => {
    const username = window.localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }

    const accessToken = window.localStorage.getItem('access_token');
    const expiresAt = window.localStorage.getItem('expires_at');
    const currentTime = Date.now();

    if (accessToken && expiresAt && currentTime <= expiresAt) {
      setLoggedIn(true);
      setAccessToken(window.localStorage.getItem('access_token'));
    } else {
      setLoggedIn(false);
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('expires_at');
    }
  }

  return (
    <AuthContext.Provider value={{username, setUsername, password, setPassword, accessToken, setAccessToken, loggedIn, setLoggedIn}}>
      <Header loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen}  />
      <Home />
      <LoginModal loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
    </AuthContext.Provider>
  );
}

export default App;