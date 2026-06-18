import db from "../db/db.js";
import crypto from "crypto";
import User from '../models/user.js';

export default function UserDao() {

    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *
                FROM users
                WHERE username = ?
            `;

            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                } else {
                    crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
                        if (err) {
                            reject(err);
                        } else {
                            const storedPassword = Buffer.from(row.hashed_password, "hex");

                            if (!crypto.timingSafeEqual(storedPassword, hashedPassword)) {
                                resolve(false);
                            } else {
                                const user = new User(
                                    row.user_id,
                                    row.username
                                );

                                resolve(user);
                            }
                        }
                    });
                }
            });
        });
    };

    // Retrieve the ranking ordered by best score
    this.getRanking = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT username, best_score AS bestScore
                FROM users
                WHERE best_score <> 0
                ORDER BY best_score DESC, username ASC
            `;
        
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    // Retrive the user's best score
    this.getUserBestScore = (userId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT best_score AS bestScore
                FROM users
                WHERE user_id = ?
            `;

            db.get(sql, [userId], (err, row) => {
                if (err)
                    reject(err);
                else if (!row)
                    resolve(0);
                else
                    resolve(row.bestScore);
            });
        });
    };

    // Update the user's best score only if the new score is higher
    this.updateBestScoreIfHigher = (userId, score) => {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE users
                SET best_score = ?
                WHERE user_id = ?
                  AND best_score < ?
            `;

            db.run(sql, [score, userId, score], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    };

}