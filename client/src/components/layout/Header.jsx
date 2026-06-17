import { useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';

import './Header.css';

function Header() {
    const { user, loggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    return (
        <header className="app-header">
            <Container className="app-header-container">
                <Link to="/" className="app-header-brand">
                    <span className="app-header-logo">
                        <i className="bi bi-train-front" />
                    </span>

                    <span>Last Race</span>
                </Link>

                <div className="app-header-actions">
                    {loggedIn ? (
                        <>
                            <div className="app-header-user">
                                <i className="bi bi-person-circle" />
                                <span>{user?.username}</span>
                            </div>

                            <Button
                                variant="outline-light"
                                size="sm"
                                className="app-header-button"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button
                            as={Link}
                            to="/login"
                            variant="light"
                            size="sm"
                            className="app-header-button"
                        >
                            <i className="bi bi-box-arrow-in-right" />
                            Login
                        </Button>
                    )}
                </div>
            </Container>
        </header>
    );
}

export default Header;