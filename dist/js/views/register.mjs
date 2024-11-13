import { registerUser } from '../api/auth.mjs';
import { setToken } from '../utils/storage.mjs';
import { redirectToDashboard } from '../utils/redirect.mjs';

document.querySelector('[data-register-form]').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {};
    formData.forEach((value, key) => {
        userData[key] = value;
    });

    try {
        const responseData = await registerUser(userData);
        
        if (responseData.token) {
            setToken(responseData.token); 
        } else {
            console.warn('No token received from registration response.');
        }
        
        redirectToDashboard();
    } catch (error) {
        console.error('Registration failed:', error.message);
        document.querySelector('#error-message').textContent = error.message; // Show error to the user
    }
});
