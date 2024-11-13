import { loginUser } from '../api/auth.mjs';
import { setToken } from '../utils/storage.mjs';
import { redirectToDashboard } from '../utils/redirect.mjs';

const errorMessageElement = document.querySelector('#error-message');

document.querySelector('[data-login-form]').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const credentials = {};
    formData.forEach((value, key) => {
        credentials[key] = value;
    });

    try {
        const responseData = await loginUser(credentials);
        setToken(responseData.token); 
        redirectToDashboard();
    } catch (error) {
        console.error('Login failed:', error.message);
        if (errorMessageElement) {
            errorMessageElement.textContent = error.message;
        }
    }
});