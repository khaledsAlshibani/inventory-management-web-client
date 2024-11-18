import { getToken } from '../utils/storage.mjs';

export async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    console.log('Fetch request details:');
    console.log('URL:', url);
    console.log('Options:', options);

    if (options.body) {
        try {
            console.log('Request Body:', JSON.parse(options.body));
        } catch {
            console.log('Request Body (raw):', options.body);
        }
    }

    if (options.body) {
        try {
            console.log('Request Body:', JSON.parse(options.body));
        } catch {
            console.log('Request Body (raw):', options.body);
        }
    } else {
        console.log('No body for this request.');
    }

    try {
        const response = await fetch(url, options);
        console.log('Response Status Code:', response.status);
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
