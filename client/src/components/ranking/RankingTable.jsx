import { Table } from 'react-bootstrap';

import './RankingTable.css';

function RankingTable({ ranking, currentUsername }) {
    return (
        <div className="ranking-table-card">
            <div className="ranking-table-scroll">
                <Table hover className="ranking-table mb-0">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th className="text-end">Best Score</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ranking.map((user, index) => {
                            const isCurrentUser = user.username === currentUsername;
                            const position = index + 1;

                            return (
                                <tr
                                    key={user.username}
                                    className={isCurrentUser ? 'ranking-current-user' : ''}
                                >
                                    <td>
                                        <span className={`ranking-position ranking-position-${position}`}>
                                            {position}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="ranking-player">
                                            <span>{user.username}</span>
                                        </div>
                                    </td>

                                    <td className="text-end">
                                        <span className="ranking-score">
                                            {user.bestScore}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default RankingTable;