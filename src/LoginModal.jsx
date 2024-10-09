import React, { useContext, useState } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, TextField, Box, Button } from "@mui/material";
import AuthContext from "./context/AuthContext";

export function LoginModal(props) {
    const { loginModalOpen, setLoginModalOpen } = props;
    const { username, setUsername, password, setPassword, setAccessToken, setLoggedIn } = useContext(AuthContext);

    const [ loginError, setLoginError ] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': import.meta.env.VITE_CLIENT_ID,
                'client_secret': import.meta.env.VITE_CLIENT_SECRET,
                'grant_type': 'password',
                'username': username,
                'password': password
            })
        }
        try {
            const response = await fetch('auth/oauth2/token', requestOptions);
            const responseJson = await response.json();
            if (responseJson.access_token) {
                setLoginError(false);
                setLoggedIn(true);
                setAccessToken(responseJson.access_token)
                window.localStorage.setItem("username", username);
                window.localStorage.setItem("access_token", responseJson.access_token);
                const expiresInSeconds = responseJson.expires_in;
                const currentTimeMilliseconds = Date.now();
                const expiresAtMilliseconds = calculateTimeOfTokenExpiration(currentTimeMilliseconds, expiresInSeconds);
                window.localStorage.setItem("expires_at", expiresAtMilliseconds);
            }
        }
        catch(error) {
            setLoginError(true);
            console.log(error);
        }
        finally {
            setLoginModalOpen(!loginModalOpen);
        }
    }

    const calculateTimeOfTokenExpiration = (currentTimeMilliseconds, expiresInSeconds) => {
        const expiresInMilliseconds = expiresInSeconds * 1000;
        const expiresAtMilliseconds = currentTimeMilliseconds + expiresInMilliseconds;
        return expiresAtMilliseconds;

    }

    return (
        <Dialog sx={{ mb: "5rem" }} open={loginModalOpen} onClose={() => setLoginModalOpen(!loginModalOpen)}>
            <DialogTitle>Please enter your credentials</DialogTitle>
            <form id="login" onSubmit={handleLogin}>
            <DialogContent>
                <TextField sx={{ mb: "0.5rem" }} label="Username" fullWidth defaultValue={username} onChange={(e) => {setUsername(e.target.value)}} />
                <TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
                {loginError && <Box sx={{ color: "red" }}>Login failed. Please try again.</Box>}
            </DialogContent>
            <DialogActions>
                <Button type="submit">Submit</Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}