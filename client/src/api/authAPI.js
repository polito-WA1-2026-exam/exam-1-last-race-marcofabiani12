import { fetchJson } from './API';

async function getUserInfo() {
    return await fetchJson('/api/sessions/current');
}

async function logIn(credentials) {
    return await fetchJson('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
}

async function logOut() {
    return await fetchJson('/api/sessions/current', {
        method: 'DELETE'
    });
}

export {
    getUserInfo,
    logIn,
    logOut
};