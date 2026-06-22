// Loads and caches the static underground network at startup.
// The cached data is reused by both network APIs and game logic.
export default function NetworkService(networkDao) {

    let stationsCache = [];
    let linesCache = [];
    let lineStationsCache = [];
    let segmentsCache = [];

    this.init = async () => {
        const [stations, segments] = await Promise.all([
            networkDao.getStations(),
            networkDao.getSegments()
        ]);

        stationsCache = stations;
        segmentsCache = segments;
    };

    this.getStations = () => {
        return stationsCache;
    };

    this.getSegments = () => {
        return segmentsCache;
    };
}