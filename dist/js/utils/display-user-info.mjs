import { hasLocalStorageItem, hasQuerySelector } from './error-handler.mjs'

export function displayUserName(elementSelector = '[data-display-user-name]') {
    console.log('displayUserName called');
    console.log(`hasLocalStorageItem('userName'): ${hasLocalStorageItem('userName')}`);
    console.log(`hasQuerySelector('${elementSelector}'): ${hasQuerySelector(elementSelector)}`);
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
    console.log('displayUserEmail called');
    console.log(`hasLocalStorageItem('userEmail'): ${hasLocalStorageItem('userEmail')}`);
    console.log(`hasQuerySelector('${elementSelector}'): ${hasQuerySelector(elementSelector)}`);
    if (hasLocalStorageItem('userEmail') && hasQuerySelector(elementSelector)) {
        const userEmail = localStorage.getItem('userEmail');
        console.log(`userEmail from localStorage: ${userEmail}`);
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
