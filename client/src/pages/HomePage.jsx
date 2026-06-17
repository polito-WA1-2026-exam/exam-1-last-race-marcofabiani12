import { useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    ClipboardCheck,
    Clock,
    Dice6,
    Map,
    PlayFill,
    Trophy
} from 'react-bootstrap-icons';

import AuthContext from '../contexts/AuthContext.jsx';

import './HomePage.css';

const phases = [
    {
        number: 1,
        title: 'Setup',
        theme: 'setup',
        icon: <Map />,
        text: 'Study the underground map before starting the race.'
    },
    {
        number: 2,
        title: 'Planning',
        theme: 'planning',
        icon: <ClipboardCheck />,
        text: 'Build your route in 90 seconds by selecting station pairs.'
    },
    {
        number: 3,
        title: 'Execution',
        theme: 'execution',
        icon: <Dice6 />,
        text: 'Travel your route step by step and face random events.'
    },
    {
        number: 4,
        title: 'Result',
        theme: 'result',
        icon: <Trophy />,
        text: 'Check your final score and see your position in the ranking.'
    }
];

function HomePage() {
    const { loggedIn } = useContext(AuthContext);

    return (
        <div className="home-page">
            <section className="home-hero text-center">
                <span className="metro-pill">
                    <Clock />
                    Underground Challenge
                </span>

                <h1 className="home-page-title">How to play</h1>
            </section>

            <section className="instructions-section">
                <Row className="g-4">
                    {phases.map(phase => (
                        <Col key={phase.number} md={3}>
                            <div className={`instruction-card phase-${phase.theme} h-100`}>
                                <div className="phase-number">
                                    {phase.number}
                                </div>

                                <div className="phase-icon">
                                    {phase.icon}
                                </div>

                                <h3>{phase.title}</h3>

                                <p>{phase.text}</p>

                            </div>
                        </Col>
                    ))}
                </Row>
            </section>

            <section className="home-actions">
                {loggedIn ? (
                    <>
                        <Button as={Link} to="/game" variant="primary" size="lg">
                            <PlayFill />
                            Start New Game
                        </Button>

                        <Button as={Link} to="/ranking" variant="outline-primary" size="lg">
                            View Ranking
                        </Button>
                    </>
                ) : (
                    <Button as={Link} to="/login" variant="primary" size="lg">
                        Login to play
                    </Button>
                )}
            </section>
        </div>
    );
}

export default HomePage;