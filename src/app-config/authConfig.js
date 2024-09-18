const authConfig= {
    clientId: `${import.meta.env.VITE_PUBLIC_CLIENT_ID}`,
    authorizationEndpoint: `${import.meta.env.VITE_API_BASE_URL}/tenants/${import.meta.env.VITE_TENANT_ID}/oauth2/auth`,
    tokenEndpoint: `${import.meta.env.VITE_API_BASE_URL}/tenants/${import.meta.env.VITE_TENANT_ID}/oauth2/token`,
    redirectUri: `${import.meta.env.VITE_REDIRECT_URI}`, 
    scope: 'openid',
    onRefreshTokenExpire: (event) => event.logIn("redirect"),
    clearURL: true,
    storage: 'local'
}

export default authConfig;