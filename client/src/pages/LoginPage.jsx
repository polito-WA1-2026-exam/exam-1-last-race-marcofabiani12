import { useContext } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/auth/LoginForm.jsx';
import AuthContext from '../contexts/AuthContext.jsx';

import './LoginPage.css';

const loginNotes = [
    {
        icon: 'bi bi-compass',
        title: 'New journey',
        text: 'Each game starts with a different route to discover.'
    },
    {
        icon: 'bi bi-lightning-charge',
        title: 'Unexpected events',
        text: 'Every segment may change your fate along the way.'
    },
    {
        icon: 'bi bi-trophy',
        title: 'Best score',
        text: 'Improve your personal record and climb the ranking.'
    }
];

function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogin(credentials) {
        await login(credentials);
        navigate('/');
    }

    return (
        <div className="login-page">
            <Row className="login-layout justify-content-center align-items-stretch g-4">
                <Col lg={5} xl={5}>
                    <section className="login-info-panel page-card h-100">
                        <span className="metro-pill">
                            <i className="bi bi-train-front" />
                            Player area
                        </span>

                        <h1 className="login-page-title">
                            Enter the underground network
                        </h1>

                        <p className="login-page-description">
                            The stations are waiting. Your next destination awaits.
                        </p>

                        <div className="login-feature-list">
                            {loginNotes.map(note => (
                                <article className="login-feature" key={note.title}>
                                    <div className="login-feature-icon">
                                        <i className={note.icon} />
                                    </div>

                                    <div>
                                        <h2>{note.title}</h2>
                                        <p>{note.text}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </Col>

                <Col lg={5} xl={5}>
                    <Card className="login-card page-card h-100">
                        <Card.Body>
                            <div className="login-card-header">
                                <div className="login-card-icon">
                                    <i className="bi bi-person-lock" />
                                </div>

                                <div>
                                    <Card.Title as="h2" className="login-card-title">
                                        Login
                                    </Card.Title>
                                    <Card.Text className="muted-text mb-0">
                                        Enter your credentials to continue.
                                    </Card.Text>
                                </div>
                            </div>

                            <LoginForm onLogin={handleLogin} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default LoginPage;