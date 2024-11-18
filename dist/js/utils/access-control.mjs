import { isUserLoggedIn } from './auth.mjs';
import { redirectToDashboard, redirectToLogin } from './redirect.mjs';

/**
 * Access control configuration
 *
 * allowedForLoggedIn - list of pages that require a user to be logged in
 * restrictedForLoggedIn - list of pages that require a user to be logged out
 */
const accessConfig = {
    allowedForLoggedIn: [
        '/dashboard.html',
        '/inventories.html',
        '/product-listing.html',
    ],
    restrictedForLoggedIn: [
        '/login.html',
        '/register.html',
    ],
};


export function checkPageAccess() {
    const currentPage = window.location.pathname;

    if (isUserLoggedIn()) {
        if (accessConfig.restrictedForLoggedIn.includes(currentPage)) {
            redirectToDashboard();
            return true; 
        }
    } else {
        if (accessConfig.allowedForLoggedIn.includes(currentPage)) {
            redirectToLogin();
            return true;
        }
    }
    return false;
}