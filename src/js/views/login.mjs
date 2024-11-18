import { loginUser } from '../api/user.mjs';
import { setToken, setUserInfo } from '../utils/storage.mjs';
import { redirectToDashboard } from '../utils/redirect.mjs';

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
        setUserInfo({
            id: responseData.id,
            username: responseData.username,
            name: responseData.name,
            email: responseData.email,
            photoPath: responseData.photoPath,
        });
        redirectToDashboard();
    } catch (error) {
        console.error('Login failed:', error.message);
        document.querySelector('#error-message').textContent = error.message;
    }
});
