import React, { useContext, useState } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, TextField, Box, Button, CircularProgress } from "@mui/material";
import AuthContext from "./context/AuthContext";

export function LoginModal(props) {
    const { loginModalOpen, setLoginModalOpen } = props;
    const { username, setUsername, setPassword, getAccessToken, setLoggedIn } = useContext(AuthContext);

    const [ loginError, setLoginError ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await getAccessToken(true);
            setLoginModalOpen(false);
            setLoginError(false);
            setLoggedIn(true);
        } catch(error) {
            setLoginError(true);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog 
            sx={{ mb: "5rem" }} 
            open={loginModalOpen} 
            closeAfterTransition={false} 
            onClose={() => setLoginModalOpen(!loginModalOpen)}
        >
            <DialogTitle>Please enter your credentials</DialogTitle>
            <form id="login" onSubmit={handleLogin}>
            <DialogContent>
                <TextField sx={{ mb: "0.5rem" }} label="Username" fullWidth onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
                {loginError && <Box sx={{ color: "red" }}>Login failed. Please try again.</Box>}
            </DialogContent>
            <DialogActions>
                {loading && <CircularProgress />}
                <Button type="submit">Submit</Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}