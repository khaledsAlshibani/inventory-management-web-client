import { hasLocalStorageItem, hasQuerySelector } from './error-handler.mjs'

export function displayUserName(elementSelector = '[data-display-user-name]') {
    if (hasLocalStorageItem('userName') && hasQuerySelector(elementSelector)) {
        const userName = localStorage.getItem('userName');
        if (userName) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.textContent = `Welcome, ${userName}!`;
            } else {
                console.log(`No element found for selector '${elementSelector}'`);
            }
        } else {
            console.log('No userName found in localStorage');
        }
    }
}

export function displayUserEmail(elementSelector = '[data-display-user-email]') {
    if (hasLocalStorageItem('userEmail') && hasQuerySelector(elementSelector)) {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.textContent = `Email: ${userEmail}`;
            } else {
                console.log(`No element found for selector '${elementSelector}'`);
            }
        } else {
            console.log('No userEmail found in localStorage');
        }
    }
}