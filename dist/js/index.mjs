import { checkAccess, isUserLoggedIn, logout } from "./utils/auth.mjs";
import { displayUserName, displayUserEmail } from "./utils/display-user-info.mjs";

console.log("isUserLoggedIn:", isUserLoggedIn());

checkAccess();

function setupLogoutButton() {
    const logoutButton = document.querySelector('[data-logout]');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => logout());
    }
}

if (isUserLoggedIn()) {
    setupLogoutButton();
    displayUserName();
    displayUserEmail();
}