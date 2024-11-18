// API Version and Base URL
export const API_VERSION = `v1`;
export const API_BASE_URL = `http://localhost:8082/api/${API_VERSION}`;

/* User Endpoints */
export const API_USERS = `${API_BASE_URL}/users`;
export const API_LOGIN = `${API_USERS}/login`;
export const API_REGISTER = `${API_USERS}`;
export const API_PROFILE = `${API_USERS}/profile`;
export const API_USER_PROFILE = (userId) => `${API_USERS}/${userId}`;
export const API_UPDATE_PASSWORD = (userId) => `${API_USERS}/${userId}/password`;

/* Inventory Endpoints */
export const API_INVENTORIES = `${API_BASE_URL}/inventories`;
export const API_USER_INVENTORIES = `${API_USERS}/inventories`;
export const API_INVENTORIES_STATS = `${API_INVENTORIES}/statistics`;

/* Product Endpoints */
export const API_PRODUCTS = `${API_BASE_URL}/products`;
export const API_PRODUCT_DETAILS = (productId) => `${API_PRODUCTS}/${productId}`;