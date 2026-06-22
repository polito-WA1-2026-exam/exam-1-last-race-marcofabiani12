const SERVER_URL = 'http://localhost:3001';

async function fetchJson(url, options = {}) {
    const response = await fetch(
        `${SERVER_URL}${url}`,
        {
            credentials: 'include',
            ...options
        }
    );

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        const error = json || { error: 'API error' };
        error.status = response.status;
        throw error;
    }

    return json;
}

export { fetchJson };