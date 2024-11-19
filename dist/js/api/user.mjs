import { API_PROFILE, API_USER_INVENTORIES, API_USER_PRODUCTS } from './api-config.mjs';
import { fetchWithAuth } from './auth.mjs'; import { API_LOGIN } from './api-config.mjs';
import { API_REGISTER } from './api-config.mjs';
import { setUserInfo } from '../utils/storage.mjs';

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

export async function getUserProducts() {
    const response = await fetchWithAuth(API_USER_PRODUCTS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user products.');
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

export async function updateUserProfile(updatedData, photoFile) {
    const formData = new FormData();

    formData.append('user', new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

    if (photoFile) {
        formData.append('photo', photoFile);
    }

    try {
        console.log('Sending FormData to API...');
        const response = await fetchWithAuth(API_PROFILE, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error(errorData.message || 'Failed to update profile.');
        }

        const responseData = await response.json();
        console.log('API successful response:', responseData);

        // Update local storage with new user info
        setUserInfo(responseData);

        return responseData;
    } catch (error) {
        console.error('Error during API request:', error);
        throw error;
    }
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