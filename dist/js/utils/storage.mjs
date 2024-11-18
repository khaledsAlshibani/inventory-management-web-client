export function setToken(token) {
    localStorage.setItem('jwtToken', token);
}

export function getToken() {
    return localStorage.getItem('jwtToken');
}

export function setUserInfo(userInfo) {
    localStorage.setItem('userId', userInfo.id);
    localStorage.setItem('username', userInfo.username);
    localStorage.setItem('userName', userInfo.name);
    localStorage.setItem('userEmail', userInfo.email);
}

export function getUserInfo() {
    return {
        id: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail')
    };
}

export function removeUserInfo() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
}