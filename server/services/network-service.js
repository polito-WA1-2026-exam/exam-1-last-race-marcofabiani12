// Loads and caches the static underground network at startup.
// The cached data is reused by both network APIs and game logic.
export default function NetworkService(networkDao) {

    let stationsCache = [];
    let linesCache = [];
    let lineStationsCache = [];
    let segmentsCache = [];

    this.init = async () => {
        const [stations, lines, lineStations, segments] = await Promise.all([
            networkDao.getStations(),
            networkDao.getLines(),
            networkDao.getLineStations(),
            networkDao.getSegments()
        ]);

        stationsCache = stations;
        linesCache = lines;
        lineStationsCache = lineStations;
        segmentsCache = segments;
    };

    this.getFullNetwork = () => {
        return {
            stations: stationsCache,
            lines: linesCache,
            lineStations: lineStationsCache
        };
    };

    this.getStations = () => {
        return stationsCache;
    };

    this.getSegments = () => {
        return segmentsCache;
    };
}