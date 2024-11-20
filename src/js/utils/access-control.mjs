import { isUserLoggedIn } from './auth.mjs';
import { redirectToDashboard, redirectToLogin } from './redirect.mjs';

/**
 * Access control configuration
 *
 * restrictedPages - list of pages that require a user to be logged in
 * noAccessForLoggedInUsers - list of pages that require a user to be logged out
 */
const routes = {
    restrictedPages: [
        '/dashboard.html',
        '/inventories.html',
        '/products.html',
        '/profile.html',
        '/inventory.html',
        '/product.html',
    ],
    noAccessForLoggedInUsers: [
        '/index.html',
        '/login.html',
        '/register.html',
    ],
};

export function checkPagesAccess() {
    const isLoggedIn = isUserLoggedIn();

    let currentPath = window.location.pathname;
    if (currentPath === '/') {
        currentPath = '/index.html';
    }

    if (isLoggedIn && routes.noAccessForLoggedInUsers.includes(currentPath)) {
        redirectToDashboard();
    } else if (!isLoggedIn && routes.restrictedPages.includes(currentPath)) {
        redirectToLogin();
    }
}