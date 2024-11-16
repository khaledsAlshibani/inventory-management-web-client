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

export function checkAccess() {
    const token = getToken();
    const isLoggedIn = !!token;
    const currentPath = window.location.pathname;

    const routes = {
        noAccessForLoggedInUsers: ['/login.html', '/register.html'],
        restrictedPages: ['/dashboard.html', '/profile.html', '/inventory.html']
    };

    if (isLoggedIn && routes.noAccessForLoggedInUsers.includes(currentPath)) {
        redirectToDashboard();
    } else if (!isLoggedIn && routes.restrictedPages.includes(currentPath)) {
        redirectToLogin();
    }
}

