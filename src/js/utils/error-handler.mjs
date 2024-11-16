export function hasLocalStorageItem(key) {
    return localStorage.getItem(key) !== null;
}

export function hasQuerySelector(elementSelector) {
    return document.querySelector(elementSelector) !== null;
}