import { fetchJson } from './API';

async function getStations() {
    return await fetchJson('/api/network/stations');
}

async function getSegments() {
    return await fetchJson('/api/network/segments');
}

export {
    getStations,
    getSegments
};