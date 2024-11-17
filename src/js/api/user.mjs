import { API_PROFILE, API_USER_INVENTORIES } from './api-config.mjs';
import { fetchWithAuth } from './auth.mjs';import { API_LOGIN } from './api-config.mjs';
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

export async function getUserInventories() {
    const response = await fetchWithAuth(API_USER_INVENTORIES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user inventories.');
    }

    return response.json();
}

export async function getUserProfile() {
    const response = await fetchWithAuth(API_PROFILE, {
        method: 'GET',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile.');
    }

    return response.json();
}

export async function updateUserProfile(updatedData) {
    const response = await fetchWithAuth(API_PROFILE, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
    }

    return response.json();
}

export async function deleteUserProfile() {
    const response = await fetchWithAuth(API_PROFILE, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete profile.');
    }

    return response.json();
}