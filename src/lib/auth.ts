export function getAuthToken() {
    return localStorage.getItem('access_token');
}

export function setAuthToken(token: string) {
    localStorage.setItem('access_token', token);
}

export function removeAuthToken() {
    localStorage.removeItem('access_token');
}

export function isAuthenticated() {
    return !!getAuthToken();
} 