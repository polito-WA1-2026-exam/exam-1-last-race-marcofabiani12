import db from "../db/db.js";
import Station from "../models/station.js";
import Line from "../models/line.js";
import LineStation from "../models/lineStation.js";
import Segment from "../models/segment.js";

export default function NetworkDao() {

    this.getStations = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT station_id, name
                FROM stations
                ORDER BY station_id
            `;

            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => new Station(row.station_id, row.name)));
            });
        });
    };

    this.getLines = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT line_id, name
                FROM lines
                ORDER BY line_id
            `;

            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => new Line(row.line_id, row.name)));
            });
        });
    };

    this.getLineStations = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT line_id, station_id, position
                FROM line_stations
                ORDER BY line_id, position
            `;

            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => new LineStation(
                    row.line_id,
                    row.station_id,
                    row.position
                )));
            });
        });
    };

    this.getSegments = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    ls1.station_id AS from_station_id,
                    ls2.station_id AS to_station_id
                FROM line_stations ls1
                JOIN line_stations ls2 
                    ON ls1.line_id = ls2.line_id
                   AND ls2.position = ls1.position + 1
                ORDER BY ls1.line_id, ls1.position
            `;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const segments = rows.map((row, index) => new Segment(
                        index + 1,
                        row.from_station_id,
                        row.to_station_id
                    ));
                    
                    resolve(segments);
                }
            });
        });
    };
}