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

export async function getInventories() {
    const response = await fetchWithAuth(API_INVENTORIES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch inventories.');
    }

    return response.json();
}

export async function getInventoryById(inventoryId) {
    const response = await fetchWithAuth(`${API_INVENTORIES}/${inventoryId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch inventory.');
    }

    return response.json();
}

export async function updateInventory(id, updatedData) {
    const response = await fetchWithAuth(`${API_INVENTORIES}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update inventory.');
    }

    return response.json();
}

export async function deleteInventory(id) {
    const response = await fetchWithAuth(`${API_INVENTORIES}/${id}`, {
        method: 'DELETE',
    });
    
    console.log(`response.status = ${response.status}`);

    if (response.status === 200 || response.status === 204) {
        return;
    }

    if (!response.ok) {
        let errorMessage = 'Failed to delete inventory.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Error parsing response JSON:', e);
        }
        throw new Error(errorMessage);
    }
}