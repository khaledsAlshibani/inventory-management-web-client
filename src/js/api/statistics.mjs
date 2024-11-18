import { API_INVENTORIES_STATS } from "./api-config.mjs";
import { fetchWithAuth } from "./auth.mjs";

export async function fetchInventoryStatistics() {
    const response = await fetchWithAuth(API_INVENTORIES_STATS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching statistics:');
    }

    return response.json();
}