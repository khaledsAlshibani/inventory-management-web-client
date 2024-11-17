import { checkAccess, isUserLoggedIn, logout } from "./utils/auth.mjs";
import { displayUserName, displayUserEmail } from "./utils/display-user-info.mjs";
import { getUserInfo } from "./utils/storage.mjs";
import { redirectExpiredToken } from "./utils/redirect.mjs";

console.log("isUserLoggedIn:", isUserLoggedIn());

checkAccess();

function setupLogoutButton() {
    const logoutButton = document.querySelector('[data-logout]');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => logout());
    }
}

if (isUserLoggedIn()) {
    redirectExpiredToken();
    setupLogoutButton();
    displayUserName();
    displayUserEmail();
    console.log(getUserInfo());
}