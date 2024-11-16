import { getToken } from '../utils/storage.mjs';
import { API_LOGIN } from './api-config.mjs';
import { API_REGISTER } from './api-config.mjs';

export async function loginUser(credentials) {
    try {
        const response = await fetch(API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login Failed!');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function registerUser(credentials) {
    try {
        const response = await fetch(API_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Register Failed!');
        }

        return await response.json();
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

export async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    console.log('Request URL:', url);
    console.log('Request Headers:', options.headers);
    if (options.body) {
        try {
            const requestBody = JSON.parse(options.body); 
            console.log('Request Body:', requestBody);
        } catch (e) {
            console.log('Request Body:', options.body);
        }
    }

    try {
        const response = await fetch(url, options);

        console.log('Response Headers:', [...response.headers.entries()]);
        console.log('Response Status:', response.status);

        const clonedResponse = response.clone();
        const responseBody = await clonedResponse.json();
        console.log('Response Body:', responseBody);

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}