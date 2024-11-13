// API Version and Base URL
export const API_VERSION = `v1`;
export const API_BASE_URL = `http://localhost:8082/api/${API_VERSION}`;

/* User Endpoints */
export const API_USERS = `${API_BASE_URL}/users`;
export const API_LOGIN = `${API_USERS}/login`;
export const API_REGISTER = `${API_USERS}`; // Register new user (POST to /users)
export const API_USER_PROFILE = (userId) => `${API_USERS}/${userId}`; // Get user by ID (e.g., /users/:id)
export const API_UPDATE_PASSWORD = (userId) => `${API_USERS}/${userId}/password`; // Update password endpoint

/* Inventory Endpoints */
export const API_INVENTORY = `${API_BASE_URL}/inventory`;
export const API_USER_INVENTORIES = (userId) => `${API_USERS}/${userId}/inventories`; // Get inventories by user
export const API_INVENTORY_ITEMS = (userId, inventoryId) => `${API_USER_INVENTORIES(userId)}/${inventoryId}/products`; // Get products in a specific inventory

/* Product Endpoints */
export const API_PRODUCTS = `${API_BASE_URL}/products`;
export const API_PRODUCT_DETAILS = (productId) => `${API_PRODUCTS}/${productId}`; // Get product by ID