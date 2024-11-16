import { API_INVENTORIES } from './api-config.mjs';
import { fetchWithAuth } from './auth.mjs';

export async function addInventory(inventoryData) {
    const response = await fetchWithAuth(API_INVENTORIES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inventoryData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add inventory.');
    }

    return response.json();
}