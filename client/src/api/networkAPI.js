import { fetchJson } from './API';

async function getFullNetwork() {
    return await fetchJson('/api/network/full');
}

async function getStations() {
    return await fetchJson('/api/network/stations');
}

async function getSegments() {
    return await fetchJson('/api/network/segments');
}

export {
    getFullNetwork,
    getStations,
    getSegments
};