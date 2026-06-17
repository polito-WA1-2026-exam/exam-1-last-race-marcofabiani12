import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';

import AuthContext from '../contexts/AuthContext.jsx';
import { getRanking } from '../api/rankingAPI.js';
import RankingTable from '../components/ranking/RankingTable.jsx';

import './RankingPage.css';

function RankingPage() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        getRanking()
            .then(data => {
                setRanking(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Unable to load ranking');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="ranking-page ranking-state-page">
                <div className="ranking-state-card page-card">
                    <Spinner animation="border" />
                    <p>Loading ranking...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ranking-page">
                <Alert variant="danger" className="ranking-alert">
                    <i className="bi bi-exclamation-triangle" />
                    <span>{error}</span>
                </Alert>
            </div>
        );
    }

    return (
        <div className="ranking-page">
            <section className="ranking-hero">
                <span className="metro-pill">
                    <i className="bi bi-bar-chart-line" />
                    General Ranking
                </span>

                <h1 className="ranking-page-title">Best racers</h1>

                <p className="ranking-page-description">
                    Compare the highest scores reached across the underground network.
                </p>
            </section>

            <section className="ranking-dashboard page-card">
                <RankingTable
                    ranking={ranking}
                    currentUsername={user?.username}
                />

                <div className="ranking-actions">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/game')}
                    >
                        <i className="bi bi-play-fill" />
                        Start New Game
                    </Button>

                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate('/')}
                    >
                        <i className="bi bi-house-door" />
                        Back to Home
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default RankingPage;