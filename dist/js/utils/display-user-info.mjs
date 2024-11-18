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

export function displayUsername(elementSelector = '[data-display-username]') {
    if (hasLocalStorageItem('username') && hasQuerySelector(elementSelector)) {
        const username = localStorage.getItem('username');
        if (username) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.textContent = `@${username}`;
            } else {
                console.log(`No element found for selector '${elementSelector}'`);
            }
        } else {
            console.log('No username found in localStorage');
        }
    }
}