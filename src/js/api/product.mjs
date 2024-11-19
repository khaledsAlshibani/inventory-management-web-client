import { API_PRODUCTS } from './api-config.mjs';
import { fetchWithAuth } from './auth.mjs';

export async function addProduct(productData) {
    const response = await fetchWithAuth(API_PRODUCTS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product.');
    }

    return response.json();
}

export async function getProducts() {
    const response = await fetchWithAuth(API_PRODUCTS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products.');
    }

    return response.json();
}

export async function getProductById(productId) {
    const response = await fetchWithAuth(`${API_PRODUCTS}/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product.');
    }

    return response.json();
}

export async function updateProduct(id, updatedData) {
    const response = await fetchWithAuth(`${API_PRODUCTS}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product.');
    }

    return response.json();
}

export async function deleteProduct(id) {
    const response = await fetchWithAuth(`${API_PRODUCTS}/${id}`, {
        method: 'DELETE',
    });
    
    console.log(`response.status = ${response.status}`);

    if (response.status === 200 || response.status === 204) {
        return;
    }

    if (!response.ok) {
        let errorMessage = 'Failed to delete product.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Error parsing response JSON:', e);
        }
        throw new Error(errorMessage);
    }
}