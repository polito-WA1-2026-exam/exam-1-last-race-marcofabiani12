import { fetchJson } from './API';

async function getRanking() {
    return await fetchJson('/api/ranking');
}

export {
    getRanking
};