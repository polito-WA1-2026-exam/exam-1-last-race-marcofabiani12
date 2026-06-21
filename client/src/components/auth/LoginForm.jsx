import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            await onLogin({ username, password });
        } catch {
            setErrorMessage('Invalid username or password');
            setLoading(false);
        }
    }

    return (
        <Form className="login-form" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>

                <Form.Control
                    type="text"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>

                <Form.Control
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                />
            </Form.Group>

            {errorMessage && (
                <Alert variant="danger" className="login-alert">
                    <i className="bi bi-exclamation-triangle" />
                    <span>{errorMessage}</span>
                </Alert>
            )}
                        
            <Button
                className="login-submit-button"
                type="submit"
                variant="primary"
                disabled={loading}
            >
                <i className="bi bi-box-arrow-in-right" />
                {loading ? 'Logging in...' : 'Login'}
            </Button>
        </Form>
    );
}

export default LoginForm;