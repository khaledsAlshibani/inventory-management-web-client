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
            throw new Error(errorData.message || 'Login failed');
        }

        return await response.json(); 
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function registerUser(userData) {
    const response = await fetch(API_REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
}