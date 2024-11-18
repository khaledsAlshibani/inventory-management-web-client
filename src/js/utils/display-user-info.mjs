import { hasLocalStorageItem, hasQuerySelector } from './error-handler.mjs'

export function displayUserPhoto(elementSelector = '[data-display-user-photo]') {
    if (hasLocalStorageItem('userPhotoPath') && hasQuerySelector(elementSelector)) {
        const userPhotoPath = localStorage.getItem('userPhotoPath');
        if (userPhotoPath) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.setAttribute('src', userPhotoPath);
            }
        }
    }
}

export function displayUserName(elementSelector = '[data-display-user-name]') {
    if (hasLocalStorageItem('userName') && hasQuerySelector(elementSelector)) {
        const userName = localStorage.getItem('userName');
        if (userName) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.textContent = `Name: ${userName}`;
            } else {
                console.log(`No element found for selector '${elementSelector}'`);
            }
        } 
    }
}

export function displayUserGreeting(elementSelector = '[data-display-user-greeting]') {
    if (hasLocalStorageItem('userName') && hasQuerySelector(elementSelector)) {
        const userName = localStorage.getItem('userName');
        if (userName) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.textContent = `Welcome, ${userName}!`;
            } else {
                console.log(`No element found for selector '${elementSelector}'`);
            }
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
        }
    }
}