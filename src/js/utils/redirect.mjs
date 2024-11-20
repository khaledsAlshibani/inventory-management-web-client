import { getToken } from "./storage.mjs";
import { parseJwt, isTokenExpired, logout } from "./auth.mjs";

export function redirectToDashboard() {
    window.location.href = '/dashboard.html';
}

export function redirectToLogin() {
    window.location.href = '/login.html';
}

export function redirectToInventories() {
    window.location.href = '/inventories.html';
}

export function redirectToProducts() {
    window.location.href = '/products.html';
}

export function redirectExpiredToken() {
    const token = getToken();


    if (!token) {
        redirectToLogin();
        return;
    }

    const payload = parseJwt(token);

    if (!payload || isTokenExpired(payload.exp)) {
        alert('Your session has expired. You will be redirected to the login page.');
        logout();
    }

    return;
}