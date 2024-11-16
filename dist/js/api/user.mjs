import { API_USER_INVENTORIES } from './api-config.mjs';
import { fetchWithAuth } from './auth.mjs';

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