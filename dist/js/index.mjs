import { checkAccess, isUserLoggedIn, logout } from "./utils/auth.mjs";

console.log("isUserLoggedIn: ", isUserLoggedIn());

checkAccess();

function implementLogOut() {
    const logoutButton = document.querySelector('[data-logout]');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => logout());
    }
}

if (isUserLoggedIn()) {
    implementLogOut();
}