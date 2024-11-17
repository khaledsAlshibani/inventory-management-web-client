import { registerUser } from '../api/user.mjs';
import { setToken, setUserInfo } from '../utils/storage.mjs';
import { redirectToDashboard } from '../utils/redirect.mjs';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-register-form]').addEventListener('submit', async function (event) {
        event.preventDefault();

        const errorMessageElement = document.querySelector('#error-message');

        const formData = new FormData(event.target);
        const credentials = {};
        formData.forEach((value, key) => {
            credentials[key] = value;
        });

        console.log("credentials ", credentials);

        try {
            const responseData = await registerUser(credentials);

            // Store the token and user info
            setToken(responseData.token);
            setUserInfo({
                id: responseData.id,
                name: responseData.name,
                email: responseData.email
            });

            // Redirect to dashboard
            redirectToDashboard();
        } catch (error) {
            console.error('Register failed:', error.message);
            if (errorMessageElement) {
                errorMessageElement.textContent = error.message;
            }
        }
    });
});