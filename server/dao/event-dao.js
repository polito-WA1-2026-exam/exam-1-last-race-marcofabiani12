import db from "../db/db.js";
import Event from "../models/event.js";

export default function EventDao() {

    this.getAllEvents = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT event_id, description, effect
                FROM events
                ORDER BY event_id
            `;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const events = rows.map(row => new Event(
                        row.event_id,
                        row.description,
                        row.effect
                    ));

                    resolve(events);
                }
            });
        });
    };

}