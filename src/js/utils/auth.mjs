import { removeUserInfo, getToken } from './storage.mjs';
import { redirectToLogin, redirectToDashboard } from './redirect.mjs';

export function isUserLoggedIn() {
    return !!getToken();
}

export function logout() {
    if (isUserLoggedIn()) {
        removeUserInfo();
        redirectToLogin();
        console.log('Logout successful');
    } else {
        console.log('No active session found.');
    }
}

export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

export function isTokenExpired(expiration) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return expiration < currentTime;
}