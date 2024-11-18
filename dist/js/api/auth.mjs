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
    console.log('body:', JSON.stringify(options.body));

    if (options.body) {
        try {
            console.log('Request Body:', JSON.parse(options.body));
        } catch {
            console.log('Request Body (raw):', options.body);
        }
    }

    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
